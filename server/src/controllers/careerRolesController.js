const prisma = require("../lib/prisma");

async function attachSkillsByName(careerRoleId, skillNames) {
  for (const rawName of skillNames) {
    const name = rawName.trim();
    if (!name) continue;

    const skill = await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    await prisma.careerRoleSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId, skillId: skill.id } },
      update: { requiredLevel: "Intermediate" },
      create: { careerRoleId, skillId: skill.id, requiredLevel: "Intermediate" },
    });
  }
}

async function getCareerRoles(req, res) {
  try {
    const roles = await prisma.careerRole.findMany({
      include: {
        skills: { include: { skill: true } },
        candidates: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const visibleRoles =
      req.user.role === "ADMIN" ? roles : roles.filter((r) => r.status === "Active");

    const allSkillIds = [
      ...new Set(visibleRoles.flatMap((r) => r.skills.map((cs) => cs.skillId))),
    ];

    const assessmentCounts = await prisma.assessment.groupBy({
      by: ["skillId"],
      _count: { id: true },
      where: { skillId: { in: allSkillIds } },
    });
    const countBySkillId = Object.fromEntries(
      assessmentCounts.map((a) => [a.skillId, a._count.id])
    );

    const result = visibleRoles.map((r) => {
      const roleSkillIds = r.skills.map((cs) => cs.skillId);
      const assessmentsCount = roleSkillIds.reduce(
        (sum, sid) => sum + (countBySkillId[sid] || 0),
        0
      );
      return {
        id: r.id,
        name: r.name,
        description: r.description,
        category: r.category,
        status: r.status,
        skillsRequired: r.skills.length,
        skills: r.skills.map((cs) => cs.skill.name),
        candidates: r.candidates.length,
        assessments: assessmentsCount,
        updatedAt: r.updatedAt,
      };
    });

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
      status: role.status,
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
    const updated = await prisma.candidateProfile.update({
      where: { userId: req.user.userId },
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
      where: { userId: req.user.userId },
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
    const { name, description, category, status, skillNames } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Career role name is required." });
    }

    const existing = await prisma.careerRole.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ error: "A career role with this name already exists." });
    }

    const careerRole = await prisma.careerRole.create({
      data: { name, description, category, status: status || "Active" },
    });

    if (Array.isArray(skillNames) && skillNames.length > 0) {
      await attachSkillsByName(careerRole.id, skillNames);
    }

    res.status(201).json(careerRole);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create career role." });
  }
}

async function updateCareerRole(req, res) {
  try {
    const { id } = req.params;
    const { name, description, category, status, skillNames } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (category !== undefined) data.category = category;
    if (status !== undefined) data.status = status;

    const careerRole = await prisma.careerRole.update({
      where: { id },
      data,
    });

    if (Array.isArray(skillNames)) {
      await prisma.careerRoleSkill.deleteMany({ where: { careerRoleId: id } });
      await attachSkillsByName(id, skillNames);
    }

    res.json(careerRole);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update career role." });
  }
}

async function deleteCareerRole(req, res) {
  try {
    const { id } = req.params;

    await prisma.careerRoleSkill.deleteMany({ where: { careerRoleId: id } });
    await prisma.careerRole.delete({ where: { id } });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    if (err.code === "P2003") {
      return res.status(409).json({
        error:
          "Cannot delete this role because one or more candidates have selected it as their target career role.",
      });
    }
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

module.exports = {
  getCareerRoles,
  createCareerRole,
  updateCareerRole,
  deleteCareerRole,
  addSkillToCareerRole,
  getCareerRoleById,
  selectCareerRole,
  getMySelectedCareerRole,
};