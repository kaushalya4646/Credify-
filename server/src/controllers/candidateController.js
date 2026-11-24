const prisma = require("../lib/prisma");

// Every handler here acts on the logged-in user's own candidate profile.
async function getOwnProfile(userId) {
  return prisma.candidateProfile.findUnique({ where: { userId } });
}

const PROFILE_NOT_FOUND = { error: "Candidate profile not found." };
const VISIBILITY = ["public", "private"];

// Optional text: trimmed, with an empty string stored as null.
// Returns { value } or { error }.
function optionalText(field, value) {
  if (value === null) return { value: null };
  if (typeof value !== "string") return { error: `${field} must be text.` };
  const trimmed = value.trim();
  return { value: trimmed === "" ? null : trimmed };
}

// Required text for names of projects/certifications.
function requiredName(value, what) {
  if (typeof value !== "string" || !value.trim()) return { error: `${what} name is required.` };
  return { value: value.trim() };
}

async function getMyProfile(req, res) {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        candidateProfile: {
          include: {
            targetCareerRole: { select: { name: true } },
            projects: { select: { id: true, name: true, link: true }, orderBy: { name: "asc" } },
            certifications: { select: { id: true, name: true }, orderBy: { name: "asc" } },
          },
        },
        skillVerifications: {
          where: { status: "Verified" },
          include: { skill: { select: { name: true } } },
        },
        attempts: {
          where: { status: "Completed" },
          orderBy: [{ completedAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
          include: { assessment: { select: { skillId: true, skill: { select: { name: true } } } } },
        },
      },
    });

    if (!user || !user.candidateProfile) {
      return res.status(404).json(PROFILE_NOT_FOUND);
    }

    // Best completed score per skill, across every assessment that tests it.
    const bestBySkill = new Map();
    for (const a of user.attempts) {
      if (a.score == null) continue;
      const best = bestBySkill.get(a.assessment.skillId);
      if (best == null || a.score > best) bestBySkill.set(a.assessment.skillId, a.score);
    }

    const p = user.candidateProfile;
    res.json({
      name: user.name,
      email: user.email,
      bio: p.bio,
      education: p.education,
      links: p.links,
      careerInterests: p.careerInterests,
      technicalSkills: p.technicalSkills,
      experienceYears: p.experienceYears,
      visibility: p.visibility,
      // Read-only here; it's set through the career-role selection flow.
      targetCareerRole: p.targetCareerRole ? { name: p.targetCareerRole.name } : null,
      projects: p.projects,
      certifications: p.certifications,
      verifiedSkills: user.skillVerifications.map((v) => ({
        skillName: v.skill.name,
        // null if there's no completed attempt for this skill.
        score: bestBySkill.get(v.skillId) ?? null,
      })),
      assessmentResults: user.attempts.map((a) => ({
        skillName: a.assessment.skill.name,
        score: a.score,
        completedAt: a.completedAt,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch your profile." });
  }
}

async function updateMyProfile(req, res) {
  try {
    const userId = req.user.userId;
    const profile = await getOwnProfile(userId);
    if (!profile) return res.status(404).json(PROFILE_NOT_FOUND);

    const body = req.body || {};
    const userData = {};
    const profileData = {};

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return res.status(400).json({ error: "name cannot be empty." });
      }
      userData.name = body.name.trim();
    }
    for (const field of ["bio", "education", "links", "careerInterests", "technicalSkills"]) {
      if (body[field] === undefined) continue;
      const r = optionalText(field, body[field]);
      if (r.error) return res.status(400).json({ error: r.error });
      profileData[field] = r.value;
    }
    if (body.experienceYears !== undefined) {
      const y = body.experienceYears;
      if (y !== null && (!Number.isInteger(y) || y < 0 || y > 80)) {
        return res.status(400).json({ error: "experienceYears must be a whole number from 0 to 80 (or null)." });
      }
      profileData.experienceYears = y;
    }
    if (body.visibility !== undefined) {
      if (!VISIBILITY.includes(body.visibility)) {
        return res.status(400).json({ error: 'visibility must be "public" or "private".' });
      }
      profileData.visibility = body.visibility;
    }

    if (Object.keys(userData).length === 0 && Object.keys(profileData).length === 0) {
      return res.status(400).json({
        error: "Provide at least one of: name, bio, education, links, careerInterests, technicalSkills, experienceYears, visibility.",
      });
    }

    await prisma.$transaction([
      ...(Object.keys(userData).length ? [prisma.user.update({ where: { id: userId }, data: userData })] : []),
      ...(Object.keys(profileData).length
        ? [prisma.candidateProfile.update({ where: { id: profile.id }, data: profileData })]
        : []),
    ]);

    // Return the full, fresh profile so the client can just replace its copy.
    return getMyProfile(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update your profile." });
  }
}

// ---- Projects and certifications (only the caller's own) ----

async function createProject(req, res) {
  try {
    const profile = await getOwnProfile(req.user.userId);
    if (!profile) return res.status(404).json(PROFILE_NOT_FOUND);
    const name = requiredName(req.body?.name, "Project");
    if (name.error) return res.status(400).json({ error: name.error });
    const link = req.body?.link === undefined ? { value: null } : optionalText("link", req.body.link);
    if (link.error) return res.status(400).json({ error: link.error });

    const project = await prisma.project.create({
      data: { candidateProfileId: profile.id, name: name.value, link: link.value },
      select: { id: true, name: true, link: true },
    });
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add project." });
  }
}

async function updateProject(req, res) {
  try {
    const profile = await getOwnProfile(req.user.userId);
    if (!profile) return res.status(404).json(PROFILE_NOT_FOUND);
    // Someone else's project looks the same as a missing one.
    const existing = await prisma.project.findFirst({ where: { id: req.params.id, candidateProfileId: profile.id } });
    if (!existing) return res.status(404).json({ error: "Project not found." });

    const data = {};
    if (req.body?.name !== undefined) {
      const name = requiredName(req.body.name, "Project");
      if (name.error) return res.status(400).json({ error: name.error });
      data.name = name.value;
    }
    if (req.body?.link !== undefined) {
      const link = optionalText("link", req.body.link);
      if (link.error) return res.status(400).json({ error: link.error });
      data.link = link.value;
    }
    if (Object.keys(data).length === 0) return res.status(400).json({ error: "Provide name and/or link." });

    const project = await prisma.project.update({
      where: { id: existing.id },
      data,
      select: { id: true, name: true, link: true },
    });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update project." });
  }
}

async function deleteProject(req, res) {
  try {
    const profile = await getOwnProfile(req.user.userId);
    if (!profile) return res.status(404).json(PROFILE_NOT_FOUND);
    const { count } = await prisma.project.deleteMany({ where: { id: req.params.id, candidateProfileId: profile.id } });
    if (count === 0) return res.status(404).json({ error: "Project not found." });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete project." });
  }
}

async function createCertification(req, res) {
  try {
    const profile = await getOwnProfile(req.user.userId);
    if (!profile) return res.status(404).json(PROFILE_NOT_FOUND);
    const name = requiredName(req.body?.name, "Certification");
    if (name.error) return res.status(400).json({ error: name.error });

    const certification = await prisma.certification.create({
      data: { candidateProfileId: profile.id, name: name.value },
      select: { id: true, name: true },
    });
    res.status(201).json(certification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add certification." });
  }
}

async function updateCertification(req, res) {
  try {
    const profile = await getOwnProfile(req.user.userId);
    if (!profile) return res.status(404).json(PROFILE_NOT_FOUND);
    const existing = await prisma.certification.findFirst({
      where: { id: req.params.id, candidateProfileId: profile.id },
    });
    if (!existing) return res.status(404).json({ error: "Certification not found." });
    const name = requiredName(req.body?.name, "Certification");
    if (name.error) return res.status(400).json({ error: name.error });

    const certification = await prisma.certification.update({
      where: { id: existing.id },
      data: { name: name.value },
      select: { id: true, name: true },
    });
    res.json(certification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update certification." });
  }
}

async function deleteCertification(req, res) {
  try {
    const profile = await getOwnProfile(req.user.userId);
    if (!profile) return res.status(404).json(PROFILE_NOT_FOUND);
    const { count } = await prisma.certification.deleteMany({
      where: { id: req.params.id, candidateProfileId: profile.id },
    });
    if (count === 0) return res.status(404).json({ error: "Certification not found." });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete certification." });
  }
}

module.exports = {
  getMyProfile,
  updateMyProfile,
  createProject,
  updateProject,
  deleteProject,
  createCertification,
  updateCertification,
  deleteCertification,
};
