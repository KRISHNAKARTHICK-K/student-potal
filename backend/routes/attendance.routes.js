const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middleware/auth.middleware");

const {
  markAttendance,
  getMyAttendance,
  getClassAttendanceSummary
} = require("../controllers/attendance.controller");

// ✅ IMPORTANT — no curly braces
const downloadMyAttendancePDF = require("../controllers/attendance.pdf.controller");

const {
  exportTeacherAttendancePDF
} = require("../controllers/teacher.attendance.pdf.controller");

const {
  getClassAttendance
} = require("../controllers/teacher.attendance.controller");

console.log("✅ Attendance routes loaded");

/* =========================
   TEACHER: Class list
========================= */
router.get(
  "/class",
  authenticate,
  authorize("teacher", "admin"),
  getClassAttendance
);

/* =========================
   TEACHER: Summary
========================= */
router.get(
  "/summary",
  authenticate,
  authorize("teacher", "admin"),
  getClassAttendanceSummary
);

/* =========================
   TEACHER: Mark attendance
========================= */
router.post(
  "/mark",
  authenticate,
  authorize("teacher", "admin"),
  markAttendance
);

/* =========================
   STUDENT: View own
========================= */
router.get(
  "/my",
  authenticate,
  authorize("student"),
  getMyAttendance
);

/* =========================
   STUDENT: PDF
========================= */
router.get(
  "/pdf",
  authenticate,
  authorize("student"),
  downloadMyAttendancePDF
);

/* =========================
   TEACHER: PDF
========================= */
router.get(
  "/teacher/pdf",
  authenticate,
  authorize("teacher", "admin"),
  exportTeacherAttendancePDF
);

module.exports = router;