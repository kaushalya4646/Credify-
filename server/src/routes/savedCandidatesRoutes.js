const express = require("express");
const {
  listSavedCandidates,
  saveCandidate,
  unsaveCandidate,
  markContacted,
} = require("../controllers/savedCandidatesController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Recruiter-only throughout; every action works on the recruiter's own saved list.
router.use(requireAuth, requireRole("RECRUITER"));

router.get("/", listSavedCandidates);
router.put("/:candidateUserId", saveCandidate);
router.delete("/:candidateUserId", unsaveCandidate);
router.post("/:candidateUserId/contacted", markContacted);

module.exports = router;
