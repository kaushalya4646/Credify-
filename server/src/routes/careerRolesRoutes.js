const express = require("express");
const {
  getCareerRoles,
  createCareerRole,
  updateCareerRole,
  deleteCareerRole,
} = require("../controllers/careerRolesController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, getCareerRoles);
router.post("/", requireAuth, requireRole("ADMIN"), createCareerRole);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateCareerRole);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteCareerRole);
router.post("/:id/skills", requireAuth, requireRole("ADMIN"), addSkillToCareerRole);

module.exports = router;