const prisma = require("../lib/prisma");

// Same rule as the candidate-facing Skill Gaps page: the share of the
// candidate's target role's required skills that they have Verified.
// Returns null (not 0) when there's no role or the role has no required
// skills, so we never show a made-up number.
function computeMatch(targetCareerRole, verifiedSkillIds) {
  const required = targetCareerRole?.skills || [];
  if (required.length === 0) return null;

  const verified = new Set(verifiedSkillIds);
  const matched = required.filter((rs) => verified.has(rs.skillId)).length;
  return Math.round((matched / required.length) * 100);
}

async function searchCandidates(req, res) {
  try {
    const { skillId, careerRoleId } = req.query;
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

    const conditions = [{ visibility: "public" }];

    if (careerRoleId) {
      conditions.push({ targetCareerRoleId: careerRoleId });
    }

    if (skillId) {
      conditions.push({
        user: {
          skillVerifications: { some: { skillId, status: "Verified" } },
        },
      });
    }

    if (q) {
      const contains = { contains: q, mode: "insensitive" };
      conditions.push({
        OR: [
          { user: { name: contains } },
          { targetCareerRole: { name: contains } },
          {
            user: {
              skillVerifications: {
                some: { status: "Verified", skill: { name: contains } },
              },
            },
          },
        ],
      });
    }

    const profiles = await prisma.candidateProfile.findMany({
      where: { AND: conditions },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            skillVerifications: {
              where: { status: "Verified" },
              include: { skill: true },
            },
          },
        },
        targetCareerRole: {
          include: {
            // Draft/Inactive skills don't count toward the match.
            skills: { where: { skill: { status: "Active" } }, select: { skillId: true } },
          },
        },
      },
    });

    const candidates = profiles.map((p) => {
      const verified = p.user.skillVerifications;
      return {
        id: p.id,
        user: { id: p.user.id, name: p.user.name },
        targetCareerRole: p.targetCareerRole
          ? { name: p.targetCareerRole.name }
          : null,
        match: computeMatch(
          p.targetCareerRole,
          verified.map((v) => v.skillId),
        ),
        verifiedSkills: verified.map((v) => v.skill.name),
      };
    });

    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not search candidates." });
  }
}

async function getCandidateProfile(req, res) {
  try {
    const { id } = req.params; // userId

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            skillVerifications: { include: { skill: true } },
            attempts: {
              where: { status: "Completed" },
              orderBy: [
                { completedAt: { sort: "desc", nulls: "last" } },
                { createdAt: "desc" },
              ],
              include: { assessment: { include: { skill: true } } },
            },
          },
        },
        targetCareerRole: {
          include: {
            // Draft/Inactive skills don't count toward the match.
            skills: { where: { skill: { status: "Active" } }, select: { skillId: true } },
          },
        },
        projects: true,
        certifications: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Candidate not found." });
    }

    const { attempts, ...user } = profile.user;
    const { skills: roleSkills, ...targetCareerRole } =
      profile.targetCareerRole || {};

    const verifiedSkillIds = user.skillVerifications
      .filter((v) => v.status === "Verified")
      .map((v) => v.skillId);

    res.json({
      ...profile,
      user,
      targetCareerRole: profile.targetCareerRole ? targetCareerRole : null,
      assessmentResults: attempts.map((a) => ({
        skillName: a.assessment.skill.name,
        score: a.score,
        completedAt: a.completedAt,
      })),
      match: computeMatch(profile.targetCareerRole, verifiedSkillIds),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch candidate profile." });
  }
}

module.exports = { searchCandidates, getCandidateProfile };
