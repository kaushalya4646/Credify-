const express = require("express");
const { getSkills, createSkill, updateSkill, deleteSkill } = require("../controllers/skillsController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, getSkills);
router.post("/", requireAuth, requireRole("ADMIN"), createSkill);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateSkill);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteSkill);

module.exports = router;