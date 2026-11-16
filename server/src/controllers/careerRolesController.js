const prisma = require("../lib/prisma");

async function getCareerRoles(req, res) {
  try {
    const roles = await prisma.careerRole.findMany({
      include: { skills: true },
    });
    const result = roles.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      category: r.category,
      skillsRequired: r.skills.length,
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch career roles." });
  }
}

async function getCareerRoleById(req, res) {
  try {
    const { id } = req.params;
    const role = await prisma.careerRole.findUnique({
      where: { id },
      include: { skills: { include: { skill: true } } },
    });
    if (!role) {
      return res.status(404).json({ error: "Career role not found." });
    }
    res.json({
      id: role.id,
      name: role.name,
      description: role.description,
      category: role.category,
      requiredSkills: role.skills.map((cs) => ({
        skillId: cs.skillId,
        name: cs.skill.name,
        requiredLevel: cs.requiredLevel,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch career role." });
  }
}

async function selectCareerRole(req, res) {
  try {
    const { careerRoleId } = req.body;
    if (!careerRoleId) {
      return res.status(400).json({ error: "careerRoleId is required." });
    }
    console.log("req.user is:", req.user); // TEMPORARY — remove after debugging
    const updated = await prisma.candidateProfile.update({
      where: { userId: req.user.id },
      data: { targetCareerRoleId: careerRoleId },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not select career role." });
  }
}

async function getMySelectedCareerRole(req, res) {
  try {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        targetCareerRole: {
          include: { skills: { include: { skill: true } } },
        },
      },
    });
    if (!profile || !profile.targetCareerRole) {
      return res.json(null);
    }
    const role = profile.targetCareerRole;
    res.json({
      id: role.id,
      name: role.name,
      description: role.description,
      category: role.category,
      requiredSkills: role.skills.map((cs) => ({
        skillId: cs.skillId,
        name: cs.skill.name,
        requiredLevel: cs.requiredLevel,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch your selected career role." });
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

async function addSkillToCareerRole(req, res) {
  try {
    const { id } = req.params; // careerRoleId
    const { skillId, requiredLevel } = req.body;

    if (!skillId || !requiredLevel) {
      return res.status(400).json({ error: "skillId and requiredLevel are required." });
    }

    const link = await prisma.careerRoleSkill.create({
      data: { careerRoleId: id, skillId, requiredLevel },
    });

    res.status(201).json(link);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not attach skill to career role." });
  }
}









module.exports = { getCareerRoles, createCareerRole, updateCareerRole, deleteCareerRole, addSkillToCareerRole, getCareerRoleById, selectCareerRole, getMySelectedCareerRole  };