const prisma = require("../lib/prisma");
const crypto = require("crypto");
const bcrypt = require("bcrypt"); // if your authController uses bcryptjs instead, change this require

async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        candidateProfile: {
          select: {
            targetCareerRole: { select: { name: true } },
          },
        },
        skillVerifications: {
          select: { status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      careerRole: u.candidateProfile?.targetCareerRole?.name || null,
      verified: u.skillVerifications.some((v) => v.status === "Verified"),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch users." });
  }
}

async function setUserActiveStatus(req, res) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ error: "isActive must be true or false." });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
    });

    res.json({ id: user.id, isActive: user.isActive });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not update user status." });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Account type can't change: each type needs its own profile record.
    if (role !== undefined) {
      const current = await prisma.user.findUnique({ where: { id }, select: { role: true } });
      if (!current) {
        return res.status(404).json({ error: "User not found." });
      }
      if (role !== current.role) {
        return res.status(400).json({ error: "Account type can't be changed." });
      }
    }

    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not update user." });
  }
}

async function resetUserPassword(req, res) {
  try {
    const { id } = req.params;
    const tempPassword = crypto.randomBytes(6).toString("hex"); // 12-char temp password
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    // No email service exists in this project, so the temp password is
    // returned directly for the admin to relay to the user manually.
    res.json({ tempPassword });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not reset password." });
  }
}

// "2 assessment attempts", "1 skill verification", ...
function countLabel(n, singular, plural) {
  return `${n} ${n === 1 ? singular : plural}`;
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Check everything that references the user explicitly, in the same
    // transaction as the delete, rather than waiting for a database error.
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id },
        select: {
          candidateProfile: { select: { id: true } },
          recruiterProfile: { select: { id: true } },
          _count: { select: { attempts: true, skillVerifications: true } },
        },
      });
      if (!user) return { notFound: true };

      const blockers = [];
      if (user.candidateProfile) blockers.push("a candidate profile");
      if (user.recruiterProfile) blockers.push("a recruiter profile");
      if (user._count.attempts > 0) {
        blockers.push(countLabel(user._count.attempts, "assessment attempt", "assessment attempts"));
      }
      if (user._count.skillVerifications > 0) {
        blockers.push(countLabel(user._count.skillVerifications, "skill verification", "skill verifications"));
      }
      if (blockers.length > 0) return { blockers };

      await tx.user.delete({ where: { id } });
      return { deleted: true };
    });

    if (result.notFound) {
      return res.status(404).json({ error: "User not found." });
    }
    if (result.blockers) {
      const list =
        result.blockers.length === 1
          ? result.blockers[0]
          : `${result.blockers.slice(0, -1).join(", ")} and ${result.blockers[result.blockers.length - 1]}`;
      return res.status(409).json({
        error: `Cannot delete this user because they have ${list}. Suspend the account instead.`,
        blockedBy: result.blockers,
      });
    }
    res.status(204).send();
  } catch (err) {
    // Something started referencing the user between the check and the delete.
    if (err.code === "P2003") {
      return res.status(409).json({ error: "Cannot delete this user because other records still reference them." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not delete user." });
  }
}

module.exports = { getAllUsers, setUserActiveStatus, updateUser, resetUserPassword, deleteUser };