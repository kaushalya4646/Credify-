const prisma = require("../lib/prisma");

async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
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

module.exports = { getAllUsers, setUserActiveStatus, deleteUser };