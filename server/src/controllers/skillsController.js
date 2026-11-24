const prisma = require("../lib/prisma");

// Trim, drop blanks, and de-duplicate a list of skill names.
function cleanNames(skillNames) {
  if (!Array.isArray(skillNames)) return null;
  const names = skillNames
    .filter((n) => typeof n === "string")
    .map((n) => n.trim())
    .filter(Boolean);
  return [...new Set(names)];
}

// Human-readable list of what references a skill, e.g. "2 career roles and 1 assessment".
function describeUsage(counts) {
  const parts = [];
  const add = (n, singular, plural) => {
    if (n > 0) parts.push(`${n} ${n === 1 ? singular : plural}`);
  };
  add(counts.careerRoles, "career role", "career roles");
  add(counts.assessments, "assessment", "assessments");
  add(counts.skillVerifications, "skill verification", "skill verifications");
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

const referenceCounts = {
  _count: {
    select: { careerRoles: true, assessments: true, skillVerifications: true },
  },
};

function isInUse(skill) {
  const c = skill._count;
  return c.careerRoles > 0 || c.assessments > 0 || c.skillVerifications > 0;
}

async function getSkills(req, res) {
  try {
    const skills = await prisma.skill.findMany({
      // Same visibility rule as career roles: only admins see non-Active skills.
      where: req.user.role === "ADMIN" ? {} : { status: "Active" },
      orderBy: { name: "asc" },
      include: {
        _count: {
          // One verification row per (user, skill), so this is a count of distinct users.
          select: { skillVerifications: { where: { status: "Verified" } } },
        },
      },
    });

    res.json(
      skills.map(({ _count, ...skill }) => ({
        ...skill,
        usage: _count.skillVerifications,
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch skills." });
  }
}

async function createSkill(req, res) {
  try {
    const { category, type, status } = req.body;
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

    if (!name) {
      return res.status(400).json({ error: "Skill name is required." });
    }

    const existing = await prisma.skill.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ error: "A skill with this name already exists." });
    }

    const skill = await prisma.skill.create({
      data: { name, category, type: type ?? null, status: status || "Active" },
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
    const { name, category, type, status } = req.body;

    // Fields left out of the body are left unchanged.
    const skill = await prisma.skill.update({
      where: { id },
      data: { name, category, type, status },
    });

    res.json(skill);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Skill not found." });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: "A skill with this name already exists." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not update skill." });
  }
}

async function deleteSkill(req, res) {
  try {
    const { id } = req.params;

    const skill = await prisma.skill.findUnique({ where: { id }, include: referenceCounts });
    if (!skill) {
      return res.status(404).json({ error: "Skill not found." });
    }
    if (isInUse(skill)) {
      return res.status(409).json({
        error: `Cannot delete this skill because it's in use by ${describeUsage(skill._count)}.`,
      });
    }

    await prisma.skill.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    // Something started referencing it between the check and the delete.
    if (err.code === "P2003") {
      return res.status(409).json({ error: "Cannot delete this skill because it's in use." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not delete skill." });
  }
}

async function createSkillCategory(req, res) {
  try {
    const { type, status } = req.body;
    const category = typeof req.body.category === "string" ? req.body.category.trim() : "";
    const names = cleanNames(req.body.skillNames);

    if (!category) {
      return res.status(400).json({ error: "Category name is required." });
    }
    if (!names || names.length === 0) {
      return res.status(400).json({ error: "skillNames must be a non-empty array of skill names." });
    }

    const data = { category, type: type ?? null, status: status || "Active" };
    const skills = await prisma.$transaction(
      names.map((name) =>
        prisma.skill.upsert({
          where: { name },
          create: { name, ...data },
          update: data,
        }),
      ),
    );

    res.status(201).json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create skill category." });
  }
}

async function updateSkillCategory(req, res) {
  try {
    const { categoryName } = req.params;
    const { type, status } = req.body;
    const newCategoryName =
      typeof req.body.newCategoryName === "string" && req.body.newCategoryName.trim()
        ? req.body.newCategoryName.trim()
        : categoryName;
    const names = cleanNames(req.body.skillNames);

    if (!names || names.length === 0) {
      return res.status(400).json({ error: "skillNames must be a non-empty array of skill names." });
    }

    const existingCount = await prisma.skill.count({ where: { category: categoryName } });
    if (existingCount === 0) {
      return res.status(404).json({ error: "Skill category not found." });
    }

    const data = { category: newCategoryName, type: type ?? null, status: status || "Active" };
    const skills = await prisma.$transaction(async (tx) => {
      // Skills dropped from the list are unassigned, never deleted — they may
      // still be used by career roles, assessments or verifications.
      await tx.skill.updateMany({
        where: { category: categoryName, name: { notIn: names } },
        data: { category: null },
      });
      for (const name of names) {
        await tx.skill.upsert({ where: { name }, create: { name, ...data }, update: data });
      }
      return tx.skill.findMany({ where: { category: newCategoryName }, orderBy: { name: "asc" } });
    });

    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update skill category." });
  }
}

async function deleteSkillCategory(req, res) {
  try {
    const { categoryName } = req.params;

    const result = await prisma.$transaction(async (tx) => {
      const skills = await tx.skill.findMany({
        where: { category: categoryName },
        include: referenceCounts,
        orderBy: { name: "asc" },
      });
      if (skills.length === 0) return { notFound: true };

      // All or nothing: if any skill is referenced, delete none of them.
      const blocked = skills.filter(isInUse);
      if (blocked.length > 0) return { blocked };

      await tx.skill.deleteMany({ where: { id: { in: skills.map((s) => s.id) } } });
      return { deleted: skills.length };
    });

    if (result.notFound) {
      return res.status(404).json({ error: "Skill category not found." });
    }
    if (result.blocked) {
      return res.status(409).json({
        error: `Cannot delete this category because these skills are in use: ${result.blocked
          .map((s) => s.name)
          .join(", ")}`,
        blockedSkills: result.blocked.map((s) => ({ id: s.id, name: s.name, usedBy: describeUsage(s._count) })),
      });
    }

    res.status(204).send();
  } catch (err) {
    // A reference was added between the check and the delete; the delete was rolled back.
    if (err.code === "P2003") {
      return res.status(409).json({
        error: "Cannot delete this category because some of its skills are in use.",
      });
    }
    console.error(err);
    res.status(500).json({ error: "Could not delete skill category." });
  }
}

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
};
