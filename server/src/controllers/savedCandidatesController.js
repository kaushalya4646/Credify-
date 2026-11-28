const prisma = require("../lib/prisma");
const { getSettings } = require("../lib/settings");
const { computeMatch } = require("./recruiterController");

const DAY_MS = 24 * 60 * 60 * 1000;

const MATCH_BUCKETS = {
  "90+": (m) => m >= 90,
  "80-89": (m) => m >= 80 && m <= 89,
  "70-79": (m) => m >= 70 && m <= 79,
  below70: (m) => m < 70,
};
// Same ranges as the page's original filter: "5+" means more than 5 years.
const EXPERIENCE_BUCKETS = {
  "0-1": (y) => y >= 0 && y <= 1,
  "2-3": (y) => y >= 2 && y <= 3,
  "4-5": (y) => y >= 4 && y <= 5,
  "5+": (y) => y > 5,
};
const VERIFICATION = ["verified", "notVerified"];
const DATE_SAVED_BUCKETS = ["today", "thisWeek", "thisMonth"];
const SORTS = ["recentlySaved", "highestMatch", "nameAsc"];

// Start of each "date saved" bucket. This week / this month are the last 7 / 30
// days, the same window as the "Recently Added" count.
function dateSavedSince(bucket, now = new Date()) {
  if (bucket === "today") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  return new Date(now.getTime() - (bucket === "thisWeek" ? 7 : 30) * DAY_MS);
}

// Candidates the recruiter can still see: their profile is public.
const visibleCandidate = { candidateProfile: { is: { visibility: "public" } } };

const candidateInclude = {
  candidate: {
    select: {
      id: true,
      name: true,
      email: true,
      candidateProfile: {
        select: {
          experienceYears: true,
          targetCareerRoleId: true,
          targetCareerRole: {
            include: {
              // Draft/Inactive skills don't count toward the match (same as search).
              skills: { where: { skill: { status: "Active" } }, select: { skillId: true } },
            },
          },
        },
      },
      skillVerifications: {
        where: { status: "Verified" },
        orderBy: [{ verifiedAt: { sort: "desc", nulls: "last" } }],
        include: { skill: { select: { id: true, name: true } } },
      },
      // Latest scored assessment, ordered the same way as the profile view's results.
      attempts: {
        where: { status: "Completed", score: { not: null } },
        orderBy: [{ completedAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
        take: 1,
        include: { assessment: { select: { skill: { select: { name: true } } } } },
      },
    },
  },
};

// One saved row -> the card data. `match` is computed for filtering/sorting and
// only included in the response when candidate matching is on.
function toSavedCandidate(row) {
  const c = row.candidate;
  const profile = c.candidateProfile;
  const verified = c.skillVerifications;
  const latest = c.attempts[0];
  return {
    id: row.id,
    candidateUserId: c.id,
    user: { id: c.id, name: c.name, email: c.email },
    targetCareerRole: profile.targetCareerRole
      ? { id: profile.targetCareerRole.id, name: profile.targetCareerRole.name }
      : null,
    experienceYears: profile.experienceYears,
    match: computeMatch(profile.targetCareerRole, verified.map((v) => v.skillId)),
    // Same rule as the profile view's "Verified Profile" badge.
    verified: verified.length > 0,
    topSkills: verified.map((v) => v.skill.name),
    verifiedSkillIds: verified.map((v) => v.skillId),
    latestAssessment: latest
      ? { skillName: latest.assessment.skill.name, score: latest.score, completedAt: latest.completedAt }
      : null,
    savedAt: row.savedAt,
    contactedAt: row.contactedAt,
  };
}

// Validates the query; returns { filters } or { error }.
function parseQuery(query) {
  const str = (v) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
  const f = {
    q: str(query.q),
    careerRole: str(query.careerRole),
    skill: str(query.skill),
    matchBucket: str(query.matchBucket),
    experienceBucket: str(query.experienceBucket),
    verification: str(query.verification),
    dateSavedBucket: str(query.dateSavedBucket),
    sort: str(query.sort) || "recentlySaved",
  };
  const checks = [
    ["matchBucket", Object.keys(MATCH_BUCKETS)],
    ["experienceBucket", Object.keys(EXPERIENCE_BUCKETS)],
    ["verification", VERIFICATION],
    ["dateSavedBucket", DATE_SAVED_BUCKETS],
    ["sort", SORTS],
  ];
  for (const [name, allowed] of checks) {
    if (f[name] !== undefined && !allowed.includes(f[name])) {
      return { error: `${name} must be one of: ${allowed.join(", ")}.` };
    }
  }
  return { filters: f };
}

// GET /api/saved-candidates — { stats, candidates }
async function listSavedCandidates(req, res) {
  try {
    const { filters: f, error } = parseQuery(req.query);
    if (error) return res.status(400).json({ error });

    const [rows, settings] = await Promise.all([
      prisma.savedCandidate.findMany({
        where: { recruiterId: req.user.userId, candidate: visibleCandidate },
        include: candidateInclude,
      }),
      getSettings(),
    ]);
    const matching = settings.candidateMatching;
    const all = rows.map(toSavedCandidate);
    const now = new Date();

    // Plain counts over everything saved, not just the filtered list.
    const stats = {
      total: all.length,
      // No match numbers at all while candidate matching is off.
      highMatch: matching ? all.filter((c) => c.match != null && c.match >= 80).length : null,
      recentlyAdded: all.filter((c) => c.savedAt >= new Date(now.getTime() - 7 * DAY_MS)).length,
      contacted: all.filter((c) => c.contactedAt != null).length,
    };

    let list = all;
    if (f.q) {
      const q = f.q.toLowerCase();
      list = list.filter(
        (c) =>
          c.user.name.toLowerCase().includes(q) ||
          c.targetCareerRole?.name.toLowerCase().includes(q) ||
          c.topSkills.some((s) => s.toLowerCase().includes(q)),
      );
    }
    if (f.careerRole) list = list.filter((c) => c.targetCareerRole?.id === f.careerRole);
    if (f.skill) list = list.filter((c) => c.verifiedSkillIds.includes(f.skill));
    // A candidate without a match (no role, or matching off) isn't in any match bucket.
    if (f.matchBucket) {
      list = list.filter((c) => matching && c.match != null && MATCH_BUCKETS[f.matchBucket](c.match));
    }
    // Candidates who didn't give their experience aren't in any bucket.
    if (f.experienceBucket) {
      list = list.filter((c) => c.experienceYears != null && EXPERIENCE_BUCKETS[f.experienceBucket](c.experienceYears));
    }
    if (f.verification) list = list.filter((c) => c.verified === (f.verification === "verified"));
    if (f.dateSavedBucket) {
      const since = dateSavedSince(f.dateSavedBucket, now);
      list = list.filter((c) => c.savedAt >= since);
    }

    const byRecent = (a, b) => b.savedAt - a.savedAt;
    const sorters = {
      recentlySaved: byRecent,
      highestMatch: (a, b) => {
        if (!matching) return byRecent(a, b);
        if (a.match == null || b.match == null) return a.match == null ? (b.match == null ? byRecent(a, b) : 1) : -1;
        return b.match - a.match || byRecent(a, b);
      },
      nameAsc: (a, b) => a.user.name.localeCompare(b.user.name, undefined, { sensitivity: "base" }) || byRecent(a, b),
    };
    list = [...list].sort(sorters[f.sort]);

    res.json({
      stats,
      candidates: list.map(({ verifiedSkillIds, match, ...c }) => ({ ...c, ...(matching ? { match } : {}) })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch saved candidates." });
  }
}

// PUT /api/saved-candidates/:candidateUserId — saving twice is a no-op.
async function saveCandidate(req, res) {
  try {
    const { candidateUserId } = req.params;
    // Only candidates whose profile the recruiter can see can be saved.
    const candidate = await prisma.user.findFirst({
      where: { id: candidateUserId, role: "CANDIDATE", ...visibleCandidate },
      select: { id: true },
    });
    if (!candidate) return res.status(404).json({ error: "Candidate not found." });

    const key = { recruiterId_candidateUserId: { recruiterId: req.user.userId, candidateUserId } };
    const existing = await prisma.savedCandidate.findUnique({ where: key });
    if (existing) return res.json({ ...existing, saved: true });
    try {
      const row = await prisma.savedCandidate.create({ data: { recruiterId: req.user.userId, candidateUserId } });
      return res.status(201).json({ ...row, saved: true });
    } catch (err) {
      // Two saves at the same moment: the other one won, which is fine.
      if (err.code === "P2002") return res.json({ ...(await prisma.savedCandidate.findUnique({ where: key })), saved: true });
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save candidate." });
  }
}

// DELETE /api/saved-candidates/:candidateUserId — only the recruiter's own row; no-op if not saved.
async function unsaveCandidate(req, res) {
  try {
    await prisma.savedCandidate.deleteMany({
      where: { recruiterId: req.user.userId, candidateUserId: req.params.candidateUserId },
    });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not remove saved candidate." });
  }
}

// POST /api/saved-candidates/:candidateUserId/contacted
async function markContacted(req, res) {
  try {
    const updated = await prisma.savedCandidate.updateMany({
      where: { recruiterId: req.user.userId, candidateUserId: req.params.candidateUserId },
      data: { contactedAt: new Date() },
    });
    if (updated.count === 0) {
      return res.status(404).json({ error: "This candidate isn't in your saved candidates." });
    }
    const row = await prisma.savedCandidate.findUnique({
      where: { recruiterId_candidateUserId: { recruiterId: req.user.userId, candidateUserId: req.params.candidateUserId } },
    });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not mark candidate as contacted." });
  }
}

module.exports = { listSavedCandidates, saveCandidate, unsaveCandidate, markContacted };
