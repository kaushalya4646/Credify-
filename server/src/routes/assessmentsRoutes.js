const express = require("express");
const {
  getAssessments,
  getAssessmentById,
  createAssessment,
  addQuestion,
  submitAttempt,
  getMyAttempts,
  getAttemptById,
  updateAssessment,
  duplicateAssessment,
  deleteAssessment,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/assessmentsController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, getAssessments);
router.get("/attempts/me", requireAuth, getMyAttempts);
// Must come after /attempts/me so "me" isn't captured as an attemptId.
router.get("/attempts/:attemptId", requireAuth, getAttemptById);
router.get("/:id", requireAuth, getAssessmentById);
router.post("/", requireAuth, requireRole("ADMIN"), createAssessment);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateAssessment);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteAssessment);
router.post("/:id/duplicate", requireAuth, requireRole("ADMIN"), duplicateAssessment);
router.post("/:id/questions", requireAuth, requireRole("ADMIN"), addQuestion);
router.put("/:id/questions/:questionId", requireAuth, requireRole("ADMIN"), updateQuestion);
router.delete("/:id/questions/:questionId", requireAuth, requireRole("ADMIN"), deleteQuestion);
router.post(
  "/:id/attempts",
  requireAuth,
  requireRole("CANDIDATE"),
  submitAttempt,
);

module.exports = router;
