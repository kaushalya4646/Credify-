const express = require("express");
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
} = require("../controllers/skillsController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, getSkills);
router.post("/", requireAuth, requireRole("ADMIN"), createSkill);

// Category routes are registered before /:id so "categories" isn't read as a skill id.
router.post("/categories", requireAuth, requireRole("ADMIN"), createSkillCategory);
router.put("/categories/:categoryName", requireAuth, requireRole("ADMIN"), updateSkillCategory);
router.delete("/categories/:categoryName", requireAuth, requireRole("ADMIN"), deleteSkillCategory);

router.put("/:id", requireAuth, requireRole("ADMIN"), updateSkill);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteSkill);

module.exports = router;
