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
    console.error(err);
    res.status(500).json({ error: "Could not update user status." });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (role !== undefined) data.role = role;

    console.log("Updating user with id:", id, "data:", data);

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
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
    console.error(err);
    res.status(500).json({ error: "Could not reset password." });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete user." });
  }
}

module.exports = { getAllUsers, setUserActiveStatus, updateUser, resetUserPassword, deleteUser };