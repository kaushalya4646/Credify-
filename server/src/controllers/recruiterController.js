const prisma = require("../lib/prisma");

async function searchCandidates(req, res) {
  try {
    const { skillId, careerRoleId } = req.query;

    const candidates = await prisma.candidateProfile.findMany({
      where: {
        visibility: "public",
        ...(careerRoleId ? { targetCareerRoleId: careerRoleId } : {}),
        ...(skillId
          ? {
              user: {
                skillVerifications: {
                  some: { skillId, status: "Verified" },
                },
              },
            }
          : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        targetCareerRole: true,
      },
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
          },
        },
        targetCareerRole: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Candidate not found." });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch candidate profile." });
  }
}

module.exports = { searchCandidates, getCandidateProfile };