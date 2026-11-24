const express = require("express");
const {
  getAllUsers,
  setUserActiveStatus,
  updateUser,
  resetUserPassword,
  deleteUser,
  getDashboard,
  getReports,
} = require("../controllers/adminController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", requireAuth, requireRole("ADMIN"), getDashboard);
router.get("/reports", requireAuth, requireRole("ADMIN"), getReports);
router.get("/users", requireAuth, requireRole("ADMIN"), getAllUsers);
router.put("/users/:id/status", requireAuth, requireRole("ADMIN"), setUserActiveStatus);
router.put("/users/:id", requireAuth, requireRole("ADMIN"), updateUser);
router.post("/users/:id/reset-password", requireAuth, requireRole("ADMIN"), resetUserPassword);
router.delete("/users/:id", requireAuth, requireRole("ADMIN"), deleteUser);

module.exports = router;