const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const resumeController = require("../controllers/resume.controller");

// All routes require authentication and student role
router.use(authenticate);
router.use(role(["student"]));

// POST /api/resume - Create resume
router.post("/", resumeController.createResume);

// GET /api/resume - List user's resumes
router.get("/", resumeController.listResumes);

// GET /api/resume/:id - Get single resume
router.get("/:id", resumeController.getResume);

// PUT /api/resume/:id - Update resume
router.put("/:id", resumeController.updateResume);

// DELETE /api/resume/:id - Delete resume
router.delete("/:id", resumeController.deleteResume);

// POST /api/resume/:id/ats - Calculate ATS score
router.post("/:id/ats", resumeController.calculateResumeATS);

// GET /api/resume/:id/pdf - Download resume as PDF
router.get("/:id/pdf", resumeController.downloadResumePDF);

module.exports = router;
