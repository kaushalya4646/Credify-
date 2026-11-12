const prisma = require("../lib/prisma");

const PASSING_SCORE = 70;

async function checkSkillVerification(req, res) {
  try {
    const { skillId } = req.params;
    const userId = req.user.userId;

    const assessments = await prisma.assessment.findMany({ where: { skillId } });
    const assessmentIds = assessments.map((a) => a.id);

    const bestAttempt = await prisma.assessmentAttempt.findFirst({
      where: {
        userId,
        assessmentId: { in: assessmentIds },
        status: "Completed",
      },
      orderBy: { score: "desc" },
    });

    if (!bestAttempt || bestAttempt.score < PASSING_SCORE) {
      return res.json({
        skillId,
        status: "Not Verified",
        bestScore: bestAttempt ? bestAttempt.score : null,
      });
    }

    const verification = await prisma.skillVerification.upsert({
      where: { userId_skillId: { userId, skillId } },
      update: { status: "Verified", verifiedAt: new Date() },
      create: { userId, skillId, status: "Verified", verifiedAt: new Date() },
    });

    res.json(verification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not check skill verification." });
  }
}

async function getMyVerifications(req, res) {
  try {
    const verifications = await prisma.skillVerification.findMany({
      where: { userId: req.user.userId },
      include: { skill: true },
    });
    res.json(verifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch verifications." });
  }
}

module.exports = { checkSkillVerification, getMyVerifications };