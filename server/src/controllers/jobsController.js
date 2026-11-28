const prisma = require("../lib/prisma");
const { getSettings } = require("../lib/settings");

const EMPLOYMENT_TYPES = ["full-time", "part-time"];
const SKILL_LEVELS = ["required", "preferred", "optional"];
const CREATE_STATUSES = ["Draft", "Active"]; // "Save draft" / "Publish job"
const MATCH_LEVELS = ["required", "preferred"]; // skills that count towards the match %

// Job skills with the skill's name, required first.
const jobSkillsInclude = {
  jobSkills: {
    select: { skillId: true, level: true, skill: { select: { name: true } } },
  },
};
const LEVEL_ORDER = Object.fromEntries(SKILL_LEVELS.map((l, i) => [l, i]));

function formatSkills(jobSkills) {
  return jobSkills
    .map((js) => ({ skillId: js.skillId, name: js.skill.name, level: js.level }))
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || a.name.localeCompare(b.name));
}

// Open to candidates = Active and the deadline hasn't passed.
function isOpen(job, now = new Date()) {
  return job.status === "Active" && job.deadline > now;
}

// % of the job's required + preferred skills the candidate has Verified.
// Left out (undefined) when the job lists no required/preferred skills.
function matchPercent(jobSkills, verifiedSkillIds) {
  const counted = jobSkills.filter((js) => MATCH_LEVELS.includes(js.level));
  if (counted.length === 0) return undefined;
  const have = counted.filter((js) => verifiedSkillIds.has(js.skillId)).length;
  return Math.round((have / counted.length) * 100);
}

async function verifiedSkillIdsOf(userId) {
  const rows = await prisma.skillVerification.findMany({
    where: { userId, status: "Verified" },
    select: { skillId: true },
  });
  return new Set(rows.map((r) => r.skillId));
}

async function currentSkillIds(jobId) {
  const rows = await prisma.jobSkill.findMany({ where: { jobId }, select: { skillId: true } });
  return rows.map((r) => r.skillId);
}

const trimmed = (v) => (typeof v === "string" ? v.trim() : v);

// Validates the job fields in `body`. With `existing` (an update), fields not in
// the body keep their current values, and cross-field checks use the merged result.
// Returns { data, skills } or { error }.
async function parseJob(body, existing = null) {
  const has = (f) => body[f] !== undefined;
  const data = {};

  for (const f of ["title", "description", "country", "city"]) {
    if (!has(f)) {
      if (!existing) return { error: `${f} is required.` };
      continue;
    }
    const v = trimmed(body[f]);
    if (typeof v !== "string" || !v) return { error: `${f} cannot be empty.` };
    data[f] = v;
  }
  for (const f of ["experienceRequired", "degree", "university"]) {
    if (!has(f)) continue;
    if (body[f] !== null && typeof body[f] !== "string") return { error: `${f} must be text.` };
    data[f] = trimmed(body[f]) || null;
  }

  if (has("employmentType") || !existing) {
    if (!EMPLOYMENT_TYPES.includes(body.employmentType)) {
      return { error: `employmentType must be one of: ${EMPLOYMENT_TYPES.join(", ")}.` };
    }
    data.employmentType = body.employmentType;
  }

  if (has("currency")) {
    const c = trimmed(body.currency);
    if (typeof c !== "string" || !/^[A-Za-z]{3}$/.test(c)) {
      return { error: "currency must be a 3-letter code, e.g. LKR." };
    }
    data.currency = c.toUpperCase();
  }

  for (const f of ["salaryLow", "salaryHigh"]) {
    if (!has(f)) {
      if (!existing) return { error: `${f} is required.` };
      continue;
    }
    if (!Number.isInteger(body[f]) || body[f] < 0) {
      return { error: `${f} must be a whole number of 0 or more.` };
    }
    data[f] = body[f];
  }
  const low = data.salaryLow ?? existing?.salaryLow;
  const high = data.salaryHigh ?? existing?.salaryHigh;
  if (low > high) return { error: "salaryLow can't be greater than salaryHigh." };

  if (has("deadline") || !existing) {
    const d = new Date(body.deadline);
    if (body.deadline == null || body.deadline === "" || Number.isNaN(d.getTime())) {
      return { error: "deadline must be a valid date." };
    }
    if (d <= new Date()) return { error: "deadline must be in the future." };
    data.deadline = d;
  }

  if (existing) {
    // Status only changes through publish/close, so an update can't
    // e.g. move an Active job with applications back to Draft.
    if (has("status") && body.status !== existing.status) {
      return { error: "Use publish or close to change a job's status." };
    }
  } else {
    if (has("status") && !CREATE_STATUSES.includes(body.status)) {
      return { error: `status must be one of: ${CREATE_STATUSES.join(", ")}.` };
    }
    data.status = body.status ?? "Draft";
  }

  // Skills: required on create (may be empty), replaced on update only if given.
  let skills;
  if (has("skills") || !existing) {
    const list = body.skills ?? [];
    if (!Array.isArray(list)) return { error: "skills must be a list." };
    const seen = new Set();
    for (const s of list) {
      if (!s || typeof s.skillId !== "string" || !s.skillId) {
        return { error: "Each skill needs a skillId." };
      }
      if (!SKILL_LEVELS.includes(s.level)) {
        return { error: `Each skill's level must be one of: ${SKILL_LEVELS.join(", ")}.` };
      }
      if (seen.has(s.skillId)) return { error: "The same skill can't be added to a job twice." };
      seen.add(s.skillId);
    }
    if (list.length > 0) {
      const found = await prisma.skill.findMany({
        where: { id: { in: [...seen] } },
        select: { id: true, name: true, status: true },
      });
      if (found.length !== seen.size) return { error: "One or more skillIds don't match an existing skill." };
      // Inactive skills can't be added. One the job already had (added before it
      // was deactivated) may stay, so re-sending the current list still works.
      const kept = new Set(existing ? await currentSkillIds(existing.id) : []);
      const inactive = found.filter((s) => s.status === "Inactive" && !kept.has(s.id));
      if (inactive.length > 0) {
        const names = inactive.map((s) => `"${s.name}"`).join(", ");
        return { error: `${names} ${inactive.length === 1 ? "is" : "are"} Inactive and can't be added to a job.` };
      }
    }
    skills = list.map((s) => ({ skillId: s.skillId, level: s.level }));
  }

  return { data, skills };
}

// Loads a job for an owner-only action: 404 if missing, 403 if someone else's.
async function loadOwnJob(req, res) {
  const job = await prisma.job.findUnique({ where: { id: req.params.id } });
  if (!job) {
    res.status(404).json({ error: "Job not found." });
    return null;
  }
  if (job.recruiterId !== req.user.userId) {
    res.status(403).json({ error: "You can only manage your own jobs." });
    return null;
  }
  return job;
}

async function fullJob(id) {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { ...jobSkillsInclude, _count: { select: { applications: true } } },
  });
  const { jobSkills, _count, ...rest } = job;
  return { ...rest, skills: formatSkills(jobSkills), applicationsCount: _count.applications };
}

// POST /api/jobs
async function createJob(req, res) {
  try {
    const { data, skills, error } = await parseJob(req.body || {});
    if (error) return res.status(400).json({ error });

    // Job and skill rows are written together in one nested create.
    const job = await prisma.job.create({
      data: { ...data, recruiterId: req.user.userId, jobSkills: { create: skills } },
    });
    res.status(201).json(await fullJob(job.id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create job." });
  }
}

// PUT /api/jobs/:id
async function updateJob(req, res) {
  try {
    const job = await loadOwnJob(req, res);
    if (!job) return;
    const { data, skills, error } = await parseJob(req.body || {}, job);
    if (error) return res.status(400).json({ error });
    if (Object.keys(data).length === 0 && skills === undefined) {
      return res.status(400).json({ error: "No changes provided." });
    }

    await prisma.$transaction(async (tx) => {
      await tx.job.update({ where: { id: job.id }, data });
      if (skills !== undefined) {
        await tx.jobSkill.deleteMany({ where: { jobId: job.id } });
        await tx.jobSkill.createMany({ data: skills.map((s) => ({ ...s, jobId: job.id })) });
      }
    });
    res.json(await fullJob(job.id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update job." });
  }
}

// POST /api/jobs/:id/publish
async function publishJob(req, res) {
  try {
    const job = await loadOwnJob(req, res);
    if (!job) return;
    if (job.status !== "Draft") {
      return res.status(409).json({ error: `Only Draft jobs can be published; this job is ${job.status}.` });
    }
    // An Active job with a past deadline would never be shown to anyone.
    if (job.deadline <= new Date()) {
      return res.status(409).json({ error: "The deadline has passed. Set a new deadline before publishing." });
    }
    const updated = await prisma.job.updateMany({
      where: { id: job.id, status: "Draft" },
      data: { status: "Active" },
    });
    if (updated.count === 0) return res.status(409).json({ error: "This job is no longer a Draft." });
    res.json(await fullJob(job.id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not publish job." });
  }
}

// POST /api/jobs/:id/close
async function closeJob(req, res) {
  try {
    const job = await loadOwnJob(req, res);
    if (!job) return;
    if (job.status !== "Closed") {
      await prisma.job.update({ where: { id: job.id }, data: { status: "Closed" } });
    }
    res.json(await fullJob(job.id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not close job." });
  }
}

// DELETE /api/jobs/:id — Drafts only. Drafts are never visible to candidates,
// so they can't have applications; the status check in the delete keeps that true.
async function deleteJob(req, res) {
  try {
    const job = await loadOwnJob(req, res);
    if (!job) return;
    if (job.status !== "Draft") {
      return res.status(409).json({
        error: `Only Draft jobs can be deleted; this job is ${job.status}. Close it instead.`,
      });
    }
    const deleted = await prisma.job.deleteMany({ where: { id: job.id, status: "Draft" } });
    if (deleted.count === 0) return res.status(409).json({ error: "This job is no longer a Draft." });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete job." });
  }
}

// GET /api/jobs/mine — every status, newest first, with an application count.
async function listMyJobs(req, res) {
  try {
    const jobs = await prisma.job.findMany({
      where: { recruiterId: req.user.userId },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      include: { ...jobSkillsInclude, _count: { select: { applications: true } } },
    });
    res.json(
      jobs.map(({ jobSkills, _count, ...job }) => ({
        ...job,
        skills: formatSkills(jobSkills),
        applicationsCount: _count.applications,
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch your jobs." });
  }
}

// GET /api/jobs/:id
async function getJobById(req, res) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: jobSkillsInclude,
    });
    const privileged = job && (job.recruiterId === req.user.userId || req.user.role === "ADMIN");
    // Drafts, closed and expired jobs look missing to everyone else.
    if (!job || (!privileged && !isOpen(job))) {
      return res.status(404).json({ error: "Job not found." });
    }

    const { jobSkills, ...rest } = job;
    const result = { ...rest, skills: formatSkills(jobSkills) };
    if (privileged) {
      result.applicationsCount = await prisma.application.count({ where: { jobId: job.id } });
    }
    if (req.user.role === "CANDIDATE") {
      const [verified, application, settings] = await Promise.all([
        verifiedSkillIdsOf(req.user.userId),
        prisma.application.findUnique({
          where: { jobId_candidateUserId: { jobId: job.id, candidateUserId: req.user.userId } },
          select: { id: true, status: true },
        }),
        getSettings(),
      ]);
      // Left out when the job has no required/preferred skills or matching is turned off.
      const match = settings.candidateMatching ? matchPercent(jobSkills, verified) : undefined;
      if (match !== undefined) result.match = match;
      result.hasApplied = application?.status === "Applied";
      result.application = application;
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch job." });
  }
}

// GET /api/jobs?title=&city=&country= — open jobs only.
async function listActiveJobs(req, res) {
  try {
    const contains = (v) => ({ contains: v.trim(), mode: "insensitive" });
    const where = { status: "Active", deadline: { gt: new Date() } };
    for (const f of ["title", "city", "country"]) {
      if (typeof req.query[f] === "string" && req.query[f].trim()) where[f] = contains(req.query[f]);
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      include: jobSkillsInclude,
    });

    const isCandidate = req.user.role === "CANDIDATE";
    let verified, applications, matching;
    if (isCandidate) {
      const [v, apps, settings] = await Promise.all([
        verifiedSkillIdsOf(req.user.userId),
        prisma.application.findMany({
          where: { candidateUserId: req.user.userId, jobId: { in: jobs.map((j) => j.id) } },
          select: { id: true, jobId: true, status: true },
        }),
        getSettings(),
      ]);
      matching = settings.candidateMatching;
      verified = v;
      applications = new Map(apps.map((a) => [a.jobId, a]));
    }

    res.json(
      jobs.map(({ jobSkills, ...job }) => {
        const item = { ...job, skills: formatSkills(jobSkills) };
        if (isCandidate) {
          // Left out when the job has no required/preferred skills or matching is turned off.
          const match = matching ? matchPercent(jobSkills, verified) : undefined;
          if (match !== undefined) item.match = match;
          const app = applications.get(job.id);
          item.hasApplied = app?.status === "Applied";
          item.application = app ? { id: app.id, status: app.status } : null;
        }
        return item;
      }),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch jobs." });
  }
}

// POST /api/jobs/:id/apply
async function applyToJob(req, res) {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } });
    // Drafts are invisible to candidates, so they look missing here too.
    if (!job || job.status === "Draft") {
      return res.status(404).json({ error: "Job not found." });
    }
    if (!isOpen(job)) {
      return res.status(409).json({ error: "This job is no longer accepting applications." });
    }

    const key = { jobId_candidateUserId: { jobId: job.id, candidateUserId: req.user.userId } };
    const existing = await prisma.application.findUnique({ where: key });
    if (existing?.status === "Applied") {
      return res.status(409).json({ error: "You've already applied to this job." });
    }
    // One row per candidate per job: re-applying after withdrawing reactivates it.
    const application = existing
      ? await prisma.application.update({ where: key, data: { status: "Applied", appliedAt: new Date() } })
      : await prisma.application.create({ data: { jobId: job.id, candidateUserId: req.user.userId } });
    res.status(existing ? 200 : 201).json(application);
  } catch (err) {
    // Two apply requests at the same moment.
    if (err.code === "P2002") {
      return res.status(409).json({ error: "You've already applied to this job." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not apply to job." });
  }
}

// PUT /api/jobs/applications/:applicationId/withdraw — kept as Withdrawn, not deleted.
async function withdrawApplication(req, res) {
  try {
    const application = await prisma.application.findUnique({ where: { id: req.params.applicationId } });
    if (!application) return res.status(404).json({ error: "Application not found." });
    if (application.candidateUserId !== req.user.userId) {
      return res.status(403).json({ error: "You can only withdraw your own applications." });
    }
    if (application.status === "Withdrawn") {
      return res.status(409).json({ error: "This application has already been withdrawn." });
    }
    const updated = await prisma.application.update({
      where: { id: application.id },
      data: { status: "Withdrawn" },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not withdraw application." });
  }
}

module.exports = {
  createJob,
  updateJob,
  publishJob,
  closeJob,
  deleteJob,
  listMyJobs,
  getJobById,
  listActiveJobs,
  applyToJob,
  withdrawApplication,
};
