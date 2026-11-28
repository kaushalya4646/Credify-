const express = require("express");
const {
  createJob,
  updateJob,
  publishJob,
  closeJob,
  deleteJob,
  listMyJobs,
  getJobById,
  listActiveJobs,
  applyToJob,
  withdrawApplication,
} = require("../controllers/jobsController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();
const recruiter = [requireAuth, requireRole("RECRUITER")];
const candidate = [requireAuth, requireRole("CANDIDATE")];

// Fixed paths first so they aren't taken as a job id by "/:id".
router.get("/", requireAuth, listActiveJobs);
router.get("/mine", ...recruiter, listMyJobs);
router.post("/", ...recruiter, createJob);
router.put("/applications/:applicationId/withdraw", ...candidate, withdrawApplication);

router.get("/:id", requireAuth, getJobById);
router.put("/:id", ...recruiter, updateJob);
router.delete("/:id", ...recruiter, deleteJob);
router.post("/:id/publish", ...recruiter, publishJob);
router.post("/:id/close", ...recruiter, closeJob);
router.post("/:id/apply", ...candidate, applyToJob);

module.exports = router;
