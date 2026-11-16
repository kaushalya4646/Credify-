const express = require("express");
const {
  getCareerRoles,
  createCareerRole,
  updateCareerRole,
  deleteCareerRole,
  addSkillToCareerRole,
  getCareerRoleById,
  selectCareerRole,
  getMySelectedCareerRole,
} = require("../controllers/careerRolesController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, getCareerRoles);

router.get("/me/selected", requireAuth, requireRole("CANDIDATE"), getMySelectedCareerRole);
router.put("/me/select", requireAuth, requireRole("CANDIDATE"), selectCareerRole);

router.get("/:id", requireAuth, getCareerRoleById);
router.post("/", requireAuth, requireRole("ADMIN"), createCareerRole);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateCareerRole);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteCareerRole);
router.post("/:id/skills", requireAuth, requireRole("ADMIN"), addSkillToCareerRole);

module.exports = router;