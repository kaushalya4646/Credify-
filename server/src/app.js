const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const skillsRoutes = require("./routes/skillsRoutes");
const careerRolesRoutes = require("./routes/careerRolesRoutes");
const skillVerificationRoutes = require("./routes/skillVerificationRoutes");
const assessmentsRoutes = require("./routes/assessmentsRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/career-roles", careerRolesRoutes);
app.use("/api/skill-verifications", skillVerificationRoutes);
app.use("/api/assessments", assessmentsRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;