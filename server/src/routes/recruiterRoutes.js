const express = require("express");
const { searchCandidates, getCandidateProfile } = require("../controllers/recruiterController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/candidates", requireAuth, requireRole("RECRUITER"), searchCandidates);
router.get("/candidates/:id", requireAuth, requireRole("RECRUITER"), getCandidateProfile);

module.exports = router;