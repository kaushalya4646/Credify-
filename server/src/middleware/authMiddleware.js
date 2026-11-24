const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

// Verifies the token, then checks the account still exists and isn't suspended,
// so suspending a user also cuts off tokens they were issued before.
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { isActive: true },
    });
    if (!user) {
      return res.status(401).json({ error: "This account no longer exists." });
    }
    if (!user.isActive) {
      return res.status(403).json({ error: "This account has been suspended. Contact an administrator.", code: "ACCOUNT_SUSPENDED" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not verify your account." });
  }

  req.user = { userId: decoded.userId, role: decoded.role };
  next();
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "You don't have permission to do this." });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };