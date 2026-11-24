const prisma = require("../lib/prisma");
const crypto = require("crypto");
const bcrypt = require("bcrypt"); // if your authController uses bcryptjs instead, change this require

async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        candidateProfile: {
          select: {
            targetCareerRole: { select: { name: true } },
          },
        },
        skillVerifications: {
          select: { status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      careerRole: u.candidateProfile?.targetCareerRole?.name || null,
      verified: u.skillVerifications.some((v) => v.status === "Verified"),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch users." });
  }
}

async function setUserActiveStatus(req, res) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ error: "isActive must be true or false." });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
    });

    res.json({ id: user.id, isActive: user.isActive });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not update user status." });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Account type can't change: each type needs its own profile record.
    if (role !== undefined) {
      const current = await prisma.user.findUnique({ where: { id }, select: { role: true } });
      if (!current) {
        return res.status(404).json({ error: "User not found." });
      }
      if (role !== current.role) {
        return res.status(400).json({ error: "Account type can't be changed." });
      }
    }

    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not update user." });
  }
}

async function resetUserPassword(req, res) {
  try {
    const { id } = req.params;
    const tempPassword = crypto.randomBytes(6).toString("hex"); // 12-char temp password
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    // No email service exists in this project, so the temp password is
    // returned directly for the admin to relay to the user manually.
    res.json({ tempPassword });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not reset password." });
  }
}

// "2 assessment attempts", "1 skill verification", ...
function countLabel(n, singular, plural) {
  return `${n} ${n === 1 ? singular : plural}`;
}

// A profile field counts as filled in if it holds anything but blank text.
function isFilled(value) {
  if (value == null) return false;
  return typeof value === "string" ? value.trim() !== "" : true;
}

// Candidate profile fields that hold something the candidate entered.
const CANDIDATE_CONTENT_FIELDS = {
  bio: "bio",
  education: "education",
  links: "links",
  technicalSkills: "technical skills",
  careerInterests: "career interests",
  experienceYears: "years of experience",
};
// Recruiter profiles only hold company details (there's no saved-candidates table).
const RECRUITER_CONTENT_FIELDS = { companyName: "company name", companyWebsite: "company website" };

// Everything about a user that would be lost by deleting them. An empty
// auto-created profile is not on this list; it's removed along with the user.
function deleteBlockers(user) {
  const blockers = [];
  if (user._count.attempts > 0) {
    blockers.push(countLabel(user._count.attempts, "assessment attempt", "assessment attempts"));
  }
  if (user._count.skillVerifications > 0) {
    blockers.push(countLabel(user._count.skillVerifications, "skill verification", "skill verifications"));
  }
  const cp = user.candidateProfile;
  if (cp) {
    if (cp._count.projects > 0) blockers.push(countLabel(cp._count.projects, "project", "projects"));
    if (cp._count.certifications > 0) {
      blockers.push(countLabel(cp._count.certifications, "certification", "certifications"));
    }
    if (cp.targetCareerRoleId) blockers.push("a selected career role");
    const filled = Object.entries(CANDIDATE_CONTENT_FIELDS).filter(([f]) => isFilled(cp[f])).map(([, label]) => label);
    if (filled.length) blockers.push(`profile details (${filled.join(", ")})`);
  }
  const rp = user.recruiterProfile;
  if (rp) {
    const filled = Object.entries(RECRUITER_CONTENT_FIELDS).filter(([f]) => isFilled(rp[f])).map(([, label]) => label);
    if (filled.length) blockers.push(`recruiter details (${filled.join(", ")})`);
  }
  return blockers;
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Check everything that references the user explicitly, in the same
    // transaction as the delete, rather than waiting for a database error.
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id },
        select: {
          candidateProfile: {
            select: {
              ...Object.fromEntries(Object.keys(CANDIDATE_CONTENT_FIELDS).map((f) => [f, true])),
              targetCareerRoleId: true,
              _count: { select: { projects: true, certifications: true } },
            },
          },
          recruiterProfile: { select: { companyName: true, companyWebsite: true } },
          _count: { select: { attempts: true, skillVerifications: true } },
        },
      });
      if (!user) return { notFound: true };

      const blockers = deleteBlockers(user);
      if (blockers.length > 0) return { blockers };

      // Nothing to lose: remove the empty profile with the account.
      await tx.candidateProfile.deleteMany({ where: { userId: id } });
      await tx.recruiterProfile.deleteMany({ where: { userId: id } });
      await tx.user.delete({ where: { id } });
      return { deleted: true };
    });

    if (result.notFound) {
      return res.status(404).json({ error: "User not found." });
    }
    if (result.blockers) {
      const list =
        result.blockers.length === 1
          ? result.blockers[0]
          : `${result.blockers.slice(0, -1).join(", ")} and ${result.blockers[result.blockers.length - 1]}`;
      return res.status(409).json({
        error: `Cannot delete this user because they have ${list}. Suspend the account instead.`,
        blockedBy: result.blockers,
      });
    }
    res.status(204).send();
  } catch (err) {
    // Something started referencing the user between the check and the delete.
    if (err.code === "P2003") {
      return res.status(409).json({ error: "Cannot delete this user because other records still reference them." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not delete user." });
  }
}

const DAY_MS = 24 * 60 * 60 * 1000;

// Percentage rounded to a whole number; null when there's nothing to divide by.
function pct(part, whole) {
  return whole > 0 ? Math.round((part / whole) * 100) : null;
}

// GET /api/admin/dashboard
async function getDashboard(req, res) {
  try {
    const now = Date.now();
    const [
      totalUsers,
      candidatesCount,
      activeCandidates,
      recruitersCount,
      completedAttempts,
      recent,
      newThisWeek,
      newThisMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "CANDIDATE" } }),
      prisma.user.count({ where: { role: "CANDIDATE", isActive: true } }),
      prisma.user.count({ where: { role: "RECRUITER" } }),
      prisma.assessmentAttempt.findMany({
        where: { status: "Completed" },
        select: { score: true, assessment: { select: { passingScore: true } } },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, name: true, role: true, createdAt: true, isActive: true },
      }),
      prisma.user.count({ where: { createdAt: { gte: new Date(now - 7 * DAY_MS) } } }),
      prisma.user.count({ where: { createdAt: { gte: new Date(now - 30 * DAY_MS) } } }),
    ]);

    // Pass rate uses each attempt's own assessment pass mark. Attempts with no
    // score (assessments with only written answers) can't pass or fail, so
    // they're left out; null when there's nothing graded yet.
    const graded = completedAttempts.filter((a) => a.score != null);
    const passed = graded.filter((a) => a.score >= a.assessment.passingScore).length;

    res.json({
      totalUsers,
      candidatesCount,
      candidatesActivePct: pct(activeCandidates, candidatesCount),
      recruitersCount,
      assessmentsCompletedCount: completedAttempts.length,
      passRatePct: pct(passed, graded.length),
      recentRegistrations: recent,
      newRegistrationsThisWeek: newThisWeek,
      newRegistrationsThisMonth: newThisMonth,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load the dashboard." });
  }
}

const REPORT_RANGES = ["7", "14", "30"];
const REPORT_USER_TYPES = { Candidate: "CANDIDATE", Recruiter: "RECRUITER" };

// GET /api/admin/reports?range=7|14|30&userType=Candidate|Recruiter&careerRoleId=&skillCategory=
async function getReports(req, res) {
  try {
    const range = req.query.range ?? "30";
    const { userType, careerRoleId, skillCategory } = req.query;
    if (!REPORT_RANGES.includes(range)) {
      return res.status(400).json({ error: "range must be 7, 14 or 30." });
    }
    if (userType && !REPORT_USER_TYPES[userType]) {
      return res.status(400).json({ error: "userType must be Candidate or Recruiter." });
    }

    const since = new Date(Date.now() - Number(range) * DAY_MS);
    const skillFilter = skillCategory ? { skill: { category: skillCategory } } : {};

    const [
      totalUsers,
      completedInRange,
      skillsVerified,
      touchedVerifications,
      recruitersCount,
      roleSelections,
      allVerifications,
    ] = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: since }, ...(userType ? { role: REPORT_USER_TYPES[userType] } : {}) },
      }),
      prisma.assessmentAttempt.findMany({
        where: { status: "Completed", completedAt: { gte: since } },
        select: { score: true, assessment: { select: { passingScore: true } } },
      }),
      prisma.skillVerification.count({
        where: { status: "Verified", verifiedAt: { gte: since }, ...skillFilter },
      }),
      // Verification rows created or changed in the range (updatedAt covers both).
      prisma.skillVerification.findMany({
        where: { updatedAt: { gte: since }, ...skillFilter },
        select: { status: true },
      }),
      prisma.user.count({ where: { role: "RECRUITER" } }),
      prisma.candidateProfile.groupBy({
        by: ["targetCareerRoleId"],
        where: { targetCareerRoleId: careerRoleId ? careerRoleId : { not: null } },
        _count: { _all: true },
      }),
      prisma.skillVerification.findMany({ where: skillFilter, select: { status: true } }),
    ]);

    // Pass rate: same rule as the dashboard (each assessment's own pass mark;
    // ungraded attempts skipped; null when nothing in range was graded).
    const graded = completedInRange.filter((a) => a.score != null);
    const passed = graded.filter((a) => a.score >= a.assessment.passingScore).length;

    // Popular career roles: top 5 by selections, bar width relative to the top one.
    const roleIds = roleSelections.map((r) => r.targetCareerRoleId);
    if (careerRoleId && !roleIds.includes(careerRoleId)) roleIds.push(careerRoleId);
    const roles = await prisma.careerRole.findMany({ where: { id: { in: roleIds } }, select: { id: true, name: true } });
    const countById = new Map(roleSelections.map((r) => [r.targetCareerRoleId, r._count._all]));
    const ranked = roles
      .map((r) => ({ name: r.name, count: countById.get(r.id) ?? 0 }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, 5);
    const top = ranked[0]?.count ?? 0;
    const popularCareerRoles = ranked.map((r) => ({ ...r, pct: top > 0 ? Math.round((r.count / top) * 100) : 0 }));

    const verifiedAll = allVerifications.filter((v) => v.status === "Verified").length;
    const verifiedPct = pct(verifiedAll, allVerifications.length);

    res.json({
      filters: { range: Number(range), userType: userType || null, careerRoleId: careerRoleId || null, skillCategory: skillCategory || null },
      totalUsers,
      assessmentsCompleted: completedInRange.length,
      passRatePct: pct(passed, graded.length),
      skillsVerified,
      verificationRatePct: pct(
        touchedVerifications.filter((v) => v.status === "Verified").length,
        touchedVerifications.length,
      ),
      recruitersCount,
      popularCareerRoles,
      skillVerificationDistribution:
        verifiedPct == null ? null : { verifiedPct, unverifiedPct: 100 - verifiedPct },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load reports." });
  }
}

module.exports = {
  getAllUsers,
  setUserActiveStatus,
  updateUser,
  resetUserPassword,
  deleteUser,
  getDashboard,
  getReports,
};