const express = require("express");
const {
  getAssessments,
  getAssessmentById,
  createAssessment,
  addQuestion,
  submitAttempt,
  getMyAttempts,
} = require("../controllers/assessmentsController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, getAssessments);
router.get("/attempts/me", requireAuth, getMyAttempts);
router.get("/:id", requireAuth, getAssessmentById);
router.post("/", requireAuth, requireRole("ADMIN"), createAssessment);
router.post("/:id/questions", requireAuth, requireRole("ADMIN"), addQuestion);
router.post(
  "/:id/attempts",
  requireAuth,
  requireRole("CANDIDATE"),
  submitAttempt,
);

module.exports = router;
