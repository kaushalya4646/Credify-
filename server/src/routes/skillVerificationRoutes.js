const express = require("express");
const { getMyVerifications } = require("../controllers/skillVerificationController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", requireAuth, getMyVerifications);

module.exports = router;