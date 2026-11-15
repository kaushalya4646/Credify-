const express = require("express");
const { getAllUsers, setUserActiveStatus, deleteUser } = require("../controllers/adminController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", requireAuth, requireRole("ADMIN"), getAllUsers);
router.put("/users/:id/status", requireAuth, requireRole("ADMIN"), setUserActiveStatus);
router.delete("/users/:id", requireAuth, requireRole("ADMIN"), deleteUser);

module.exports = router;