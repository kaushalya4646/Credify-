const { getSettings, updateSettings } = require("../lib/settings");

// Allowed values per field. Fields not listed here can't be changed via the API.
const BOOLEAN_FIELDS = [
  "allowRegistration",
  "requireEmailVerification",
  "allowRecruiterRegistration",
  "randomizeQuestions",
  "skillRecommendations",
  "careerRecommendations",
  "candidateMatching",
  "platformDisabled",
];
// [min, max, nullable]
const INT_FIELDS = {
  maxAssessmentDurationMinutes: [1, 1440, false],
  maxAttempts: [1, 100, false],
  defaultPassingScore: [0, 100, false],
  minScoreForVerification: [0, 100, false],
  sessionTimeoutMinutes: [5, 43200, false], // up to 30 days
  verificationExpiryDays: [1, 3650, true], // null = never expires
  dataRetentionDays: [1, 36500, true], // null = keep forever
};
const ENUM_FIELDS = {
  verificationBadgeMode: ["Allowed", "Not allowed", "Admin approval required"],
  recruiterAccessControl: ["All candidates"],
  defaultLanguage: ["en-US", "en-GB", "en-AU"],
};

// Builds the update from the request body, or returns an error message.
function parseSettings(body) {
  const data = {};
  if (body.platformName !== undefined) {
    if (typeof body.platformName !== "string" || !body.platformName.trim() || body.platformName.trim().length > 100) {
      return { error: "platformName must be 1-100 characters." };
    }
    data.platformName = body.platformName.trim();
  }
  if (body.platformDescription !== undefined) {
    if (body.platformDescription !== null && typeof body.platformDescription !== "string") {
      return { error: "platformDescription must be text." };
    }
    data.platformDescription = body.platformDescription?.trim() || null;
  }
  for (const f of BOOLEAN_FIELDS) {
    if (body[f] === undefined) continue;
    if (typeof body[f] !== "boolean") return { error: `${f} must be true or false.` };
    data[f] = body[f];
  }
  for (const [f, [min, max, nullable]] of Object.entries(INT_FIELDS)) {
    if (body[f] === undefined) continue;
    if (body[f] === null && nullable) { data[f] = null; continue; }
    if (!Number.isInteger(body[f]) || body[f] < min || body[f] > max) {
      return { error: `${f} must be a whole number from ${min} to ${max}${nullable ? " (or null)" : ""}.` };
    }
    data[f] = body[f];
  }
  for (const [f, allowed] of Object.entries(ENUM_FIELDS)) {
    if (body[f] === undefined) continue;
    if (!allowed.includes(body[f])) return { error: `${f} must be one of: ${allowed.join(", ")}.` };
    data[f] = body[f];
  }
  return { data };
}

// GET /api/admin/settings
async function getAdminSettings(req, res) {
  try {
    res.json(await getSettings());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load settings." });
  }
}

// PUT /api/admin/settings — updates only the fields provided.
// platformDisabled is toggled through here too.
async function updateAdminSettings(req, res) {
  try {
    const { data, error } = parseSettings(req.body || {});
    if (error) return res.status(400).json({ error });
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No valid settings provided." });
    }
    res.json(await updateSettings(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save settings." });
  }
}

// GET /api/settings/public — the few flags non-admin pages need.
async function getPublicSettings(req, res) {
  try {
    const s = await getSettings();
    res.json({
      platformName: s.platformName,
      skillRecommendations: s.skillRecommendations,
      careerRecommendations: s.careerRecommendations,
      candidateMatching: s.candidateMatching,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load settings." });
  }
}

module.exports = { getAdminSettings, updateAdminSettings, getPublicSettings };
