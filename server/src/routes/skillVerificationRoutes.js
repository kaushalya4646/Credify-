const express = require("express");
const { checkSkillVerification, getMyVerifications } = require("../controllers/skillVerificationController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/check/:skillId", requireAuth, requireRole("CANDIDATE"), checkSkillVerification);
router.get("/me", requireAuth, getMyVerifications);

module.exports = router;