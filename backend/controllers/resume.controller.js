const db = require("../config/db");
const { calculateATS } = require("../services/ats.service");
const PDFDocument = require("pdfkit");

// Promisified query
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

async function validateResumeAccess(resumeId, userId) {
  const rows = await query("SELECT id, user_id FROM resumes WHERE id = ?", [resumeId]);
  if (!rows || rows.length === 0) return { valid: false, error: "Resume not found" };
  if (rows[0].user_id !== userId) return { valid: false, error: "Access denied" };
  return { valid: true };
}

async function fetchFullResume(resumeId) {
  const [resume] = await query("SELECT * FROM resumes WHERE id = ?", [resumeId]);
  if (!resume) return null;

  const skills = await query("SELECT * FROM resume_skills WHERE resume_id = ?", [resumeId]);
  const experience = await query("SELECT * FROM resume_experience WHERE resume_id = ?", [resumeId]);
  const projects = await query("SELECT * FROM resume_projects WHERE resume_id = ?", [resumeId]);
  const education = await query("SELECT * FROM resume_education WHERE resume_id = ?", [resumeId]);

  return {
    ...resume,
    skills: skills || [],
    experience: experience || [],
    projects: projects || [],
    education: education || []
  };
}

/* ================= CREATE ================= */

const createResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, summary, template } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const result = await query(
      "INSERT INTO resumes (user_id, title, summary, template) VALUES (?, ?, ?, ?)",
      [
        userId,
        title.trim().substring(0, 150),
        summary ? summary.trim() : null,
        template || "modern"
      ]
    );

    res.status(201).json({
      success: true,
      message: "Resume created",
      resumeId: result.insertId
    });
  } catch (err) {
    console.error("createResume error:", err);
    res.status(500).json({ success: false, message: "Failed to create resume" });
  }
};

/* ================= GET ONE ================= */

const getResume = async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const access = await validateResumeAccess(resumeId, userId);
    if (!access.valid) {
      return res.status(access.error === "Resume not found" ? 404 : 403).json({
        success: false,
        message: access.error
      });
    }

    const resume = await fetchFullResume(resumeId);
    res.json({ success: true, resume });
  } catch (err) {
    console.error("getResume error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch resume" });
  }
};

/* ================= LIST ================= */

const listResumes = async (req, res) => {
  try {
    const rows = await query(
      "SELECT id, title, template, ats_score, created_at FROM resumes WHERE user_id = ? ORDER BY updated_at DESC",
      [req.user.id]
    );

    res.json({ success: true, resumes: rows || [] });
  } catch (err) {
    console.error("listResumes error:", err);
    res.status(500).json({ success: false, message: "Failed to list resumes" });
  }
};

/* ================= UPDATE ================= */

const updateResume = async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const access = await validateResumeAccess(resumeId, userId);
    if (!access.valid) {
      return res.status(access.error === "Resume not found" ? 404 : 403).json({
        success: false,
        message: access.error
      });
    }

    const { title, summary, template } = req.body;

    await query(
      "UPDATE resumes SET title=?, summary=?, template=? WHERE id=?",
      [
        title?.trim()?.substring(0, 150) || null,
        summary?.trim() || null,
        template || "modern",
        resumeId
      ]
    );

    const updated = await fetchFullResume(resumeId);
    res.json({ success: true, message: "Resume updated", resume: updated });
  } catch (err) {
    console.error("updateResume error:", err);
    res.status(500).json({ success: false, message: "Failed to update resume" });
  }
};

/* ================= DELETE ================= */

const deleteResume = async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const access = await validateResumeAccess(resumeId, userId);
    if (!access.valid) {
      return res.status(access.error === "Resume not found" ? 404 : 403).json({
        success: false,
        message: access.error
      });
    }

    await query("DELETE FROM resumes WHERE id = ?", [resumeId]);
    res.json({ success: true, message: "Resume deleted" });
  } catch (err) {
    console.error("deleteResume error:", err);
    res.status(500).json({ success: false, message: "Failed to delete resume" });
  }
};

/* ================= ATS ================= */

const calculateResumeATS = async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { jobDescription } = req.body;

    if (!jobDescription || typeof jobDescription !== "string") {
      return res.status(400).json({
        success: false,
        message: "jobDescription is required"
      });
    }

    const access = await validateResumeAccess(resumeId, userId);
    if (!access.valid) {
      return res.status(access.error === "Resume not found" ? 404 : 403).json({
        success: false,
        message: access.error
      });
    }

    const resume = await fetchFullResume(resumeId);

    const result = calculateATS(
      {
        summary: resume.summary,
        skills: resume.skills,
        experience: resume.experience,
        projects: resume.projects,
        education: resume.education
      },
      jobDescription
    );

    await query("UPDATE resumes SET ats_score=? WHERE id=?", [
      result.score,
      resumeId
    ]);

    res.json({ success: true, ...result });
  } catch (err) {
    console.error("calculateResumeATS error:", err);
    res.status(500).json({ success: false, message: "Failed to calculate ATS" });
  }
};

/* ================= PDF (FIXED) ================= */

const downloadResumePDF = async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const access = await validateResumeAccess(resumeId, userId);
    if (!access.valid) {
      return res.status(access.error === "Resume not found" ? 404 : 403).json({
        success: false,
        message: access.error
      });
    }

    const resume = await fetchFullResume(resumeId);

    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="resume_${(resume.title || "resume").replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(22).font("Helvetica-Bold")
      .text(resume.title || "Resume", { align: "center" });
    doc.moveDown();

    if (resume.summary) {
      doc.fontSize(12).font("Helvetica-Bold").text("Summary", { underline: true });
      doc.moveDown(0.5);
      doc.font("Helvetica").fontSize(10)
        .text(resume.summary, { width: 500 });
      doc.moveDown();
    }

    if (resume.skills?.length) {
      doc.font("Helvetica-Bold").fontSize(12)
        .text("Skills", { underline: true });
      doc.moveDown(0.5);
      const skillNames = resume.skills.map(s => s.skill).join(" • ");
      doc.font("Helvetica").fontSize(10)
        .text(skillNames, { width: 500 });
      doc.moveDown();
    }

    if (resume.experience?.length) {
      doc.font("Helvetica-Bold").fontSize(12)
        .text("Experience", { underline: true });
      doc.moveDown(0.5);

      resume.experience.forEach(exp => {
        doc.font("Helvetica-Bold").fontSize(10)
          .text(`${exp.role || ""} at ${exp.company || ""}`);
        doc.font("Helvetica").fontSize(10)
          .text(exp.description || "", { width: 500 });
        doc.moveDown(0.5);
      });

      doc.moveDown();
    }

    if (resume.projects?.length) {
      doc.font("Helvetica-Bold").fontSize(12)
        .text("Projects", { underline: true });
      doc.moveDown(0.5);

      resume.projects.forEach(proj => {
        doc.font("Helvetica-Bold").fontSize(10)
          .text(proj.title || "");
        doc.font("Helvetica").fontSize(10)
          .text(proj.description || "", { width: 500 });
        doc.moveDown(0.5);
      });

      doc.moveDown();
    }

    if (resume.education?.length) {
      doc.font("Helvetica-Bold").fontSize(12)
        .text("Education", { underline: true });
      doc.moveDown(0.5);

      resume.education.forEach(ed => {
        doc.font("Helvetica").fontSize(10)
          .text(`${ed.degree || ""} - ${ed.institution || ""}`);
        doc.moveDown(0.5);
      });
    }

    doc.end();
  } catch (err) {
    console.error("downloadResumePDF error:", err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to generate PDF"
      });
    }
  }
};

module.exports = {
  createResume,
  getResume,
  listResumes,
  updateResume,
  deleteResume,
  calculateResumeATS,
  downloadResumePDF
};