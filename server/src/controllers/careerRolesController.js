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

// Non-admins only see Active skills in a role's requirements.
function visibleRoleSkills(req, roleSkills) {
  return req.user.role === "ADMIN"
    ? roleSkills
    : roleSkills.filter((cs) => cs.skill.status === "Active");
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

    const isAdmin = req.user.role === "ADMIN";
    const allSkillIds = [
      ...new Set(
        visibleRoles.flatMap((r) => visibleRoleSkills(req, r.skills).map((cs) => cs.skillId)),
      ),
    ];

    const assessmentCounts = await prisma.assessment.groupBy({
      by: ["skillId"],
      _count: { id: true },
      where: {
        skillId: { in: allSkillIds },
        ...(isAdmin ? {} : { status: "Active" }),
      },
    });
    const countBySkillId = Object.fromEntries(
      assessmentCounts.map((a) => [a.skillId, a._count.id])
    );

    const result = visibleRoles.map((r) => {
      const roleSkills = visibleRoleSkills(req, r.skills);
      const roleSkillIds = roleSkills.map((cs) => cs.skillId);
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
        skillsRequired: roleSkills.length,
        skills: roleSkills.map((cs) => cs.skill.name),
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
    // Draft/Inactive roles look the same as missing ones to non-admins, except a
    // candidate's own selected role, which they keep even after it's deactivated.
    if (req.user.role !== "ADMIN" && role.status !== "Active") {
      const ownSelection =
        req.user.role === "CANDIDATE" &&
        (await prisma.candidateProfile.count({
          where: { userId: req.user.userId, targetCareerRoleId: role.id },
        })) > 0;
      if (!ownSelection) {
        return res.status(404).json({ error: "Career role not found." });
      }
    }
    res.json({
      id: role.id,
      name: role.name,
      description: role.description,
      category: role.category,
      status: role.status,
      requiredSkills: visibleRoleSkills(req, role.skills).map((cs) => ({
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
    // Only Active roles can be selected.
    const role = await prisma.careerRole.findUnique({ where: { id: careerRoleId } });
    if (!role || role.status !== "Active") {
      return res.status(404).json({ error: "Career role not found." });
    }
    const updated = await prisma.candidateProfile.update({
      where: { userId: req.user.userId },
      data: { targetCareerRoleId: careerRoleId },
    });
    res.json(updated);
  } catch (err) {
    // P2003: careerRoleId doesn't match a role. P2025: this user has no candidate profile.
    if (err.code === "P2003") {
      return res.status(404).json({ error: "Career role not found." });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Candidate profile not found." });
    }
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
      requiredSkills: visibleRoleSkills(req, role.skills).map((cs) => ({
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

    // The candidate -> role foreign key is ON DELETE SET NULL, so the database
    // would silently clear candidates' selections. Check explicitly instead,
    // inside the same transaction as the delete.
    const result = await prisma.$transaction(async (tx) => {
      const selectedBy = await tx.candidateProfile.count({ where: { targetCareerRoleId: id } });
      if (selectedBy > 0) return { selectedBy };
      await tx.careerRoleSkill.deleteMany({ where: { careerRoleId: id } });
      await tx.careerRole.delete({ where: { id } });
      return { deleted: true };
    });

    if (result.selectedBy) {
      return res.status(409).json({
        error:
          "Cannot delete this role because one or more candidates have selected it as their target career role.",
      });
    }
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Career role not found." });
    }
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