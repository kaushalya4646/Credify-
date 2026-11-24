const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");
const { getSettings } = require("../lib/settings");

async function register(req, res) {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: "Email, password, name, and role are required." });
    }

    const settings = await getSettings();
    if (!settings.allowRegistration) {
      return res.status(403).json({ error: "Registration is currently closed. Please try again later." });
    }
    if (role === "RECRUITER" && !settings.allowRecruiterRegistration) {
      return res.status(403).json({ error: "Recruiter registration is currently closed." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role,
        ...(role === "CANDIDATE" ? { candidateProfile: { create: {} } } : {}),
        ...(role === "RECRUITER" ? { recruiterProfile: { create: {} } } : {}),
      },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong during registration." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Checked after the password so this doesn't reveal which emails exist.
    if (!user.isActive) {
      return res.status(403).json({ error: "This account has been suspended. Contact an administrator.", code: "ACCOUNT_SUSPENDED" });
    }

    // Maintenance mode: only admins can sign in.
    const settings = await getSettings();
    if (settings.platformDisabled && user.role !== "ADMIN") {
      return res.status(503).json({ error: "Credify is under maintenance. Please try again later.", code: "PLATFORM_DISABLED" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: `${settings.sessionTimeoutMinutes}m` }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong during login." });
  }
}

async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
}

const MIN_PASSWORD_LENGTH = 8;

// POST /api/auth/change-password, for any logged-in user.
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (typeof currentPassword !== "string" || !currentPassword) {
      return res.status(400).json({ error: "Current password is required." });
    }
    if (typeof newPassword !== "string" || newPassword.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    res.json({ message: "Password changed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not change password." });
  }
}

module.exports = { register, login, me, changePassword };