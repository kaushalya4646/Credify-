const express = require("express");
const { getPublicSettings } = require("../controllers/settingsController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Non-sensitive flags any signed-in page may need (e.g. whether to show
// "Recommended" assessments). Admin editing lives under /api/admin/settings.
router.get("/public", requireAuth, getPublicSettings);

module.exports = router;
