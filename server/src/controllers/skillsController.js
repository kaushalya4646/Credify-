const prisma = require("../lib/prisma");

async function getSkills(req, res) {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { name: "asc" },
    });
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch skills." });
  }
}

async function createSkill(req, res) {
  try {
    const { name, category } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Skill name is required." });
    }

    const existing = await prisma.skill.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ error: "A skill with this name already exists." });
    }

    const skill = await prisma.skill.create({
      data: { name, category },
    });

    res.status(201).json(skill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create skill." });
  }
}

async function updateSkill(req, res) {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    const skill = await prisma.skill.update({
      where: { id },
      data: { name, category },
    });

    res.json(skill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update skill." });
  }
}

async function deleteSkill(req, res) {
  try {
    const { id } = req.params;
    await prisma.skill.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete skill." });
  }
}

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };