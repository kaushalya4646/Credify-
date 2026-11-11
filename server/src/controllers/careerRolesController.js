const prisma = require("../lib/prisma");

async function getCareerRoles(req, res) {
  try {
    const careerRoles = await prisma.careerRole.findMany({
      orderBy: { name: "asc" },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });
    res.json(careerRoles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch career roles." });
  }
}

async function createCareerRole(req, res) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Career role name is required." });
    }

    const existing = await prisma.careerRole.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ error: "A career role with this name already exists." });
    }

    const careerRole = await prisma.careerRole.create({
      data: { name, description },
    });

    res.status(201).json(careerRole);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create career role." });
  }
}

async function updateCareerRole(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const careerRole = await prisma.careerRole.update({
      where: { id },
      data: { name, description },
    });

    res.json(careerRole);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update career role." });
  }
}

async function deleteCareerRole(req, res) {
  try {
    const { id } = req.params;
    await prisma.careerRole.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete career role." });
  }
}

module.exports = { getCareerRoles, createCareerRole, updateCareerRole, deleteCareerRole };