const prisma = require("../lib/prisma");

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

module.exports = { getMyVerifications };