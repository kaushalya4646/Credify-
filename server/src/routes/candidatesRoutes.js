const express = require("express");
const {
  getMyProfile,
  updateMyProfile,
  createProject,
  updateProject,
  deleteProject,
  createCertification,
  updateCertification,
  deleteCertification,
} = require("../controllers/candidateController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Everything here is scoped to the logged-in user's own candidate profile,
// so no role check is needed (non-candidates get 404: no profile).
// Only /me routes exist, so there's nothing for /:id to shadow.
router.get("/me", requireAuth, getMyProfile);
router.put("/me", requireAuth, updateMyProfile);

router.post("/me/projects", requireAuth, createProject);
router.put("/me/projects/:id", requireAuth, updateProject);
router.delete("/me/projects/:id", requireAuth, deleteProject);

router.post("/me/certifications", requireAuth, createCertification);
router.put("/me/certifications/:id", requireAuth, updateCertification);
router.delete("/me/certifications/:id", requireAuth, deleteCertification);

module.exports = router;
