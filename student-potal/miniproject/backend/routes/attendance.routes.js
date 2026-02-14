const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middleware/auth.middleware");

const {
  markAttendance,
  getMyAttendance
} = require("../controllers/attendance.controller");

const {
  downloadMyAttendancePDF
} = require("../controllers/attendance.pdf.controller");

const {
  exportTeacherAttendancePDF
} = require("../controllers/teacher.attendance.pdf.controller");

const { getClassAttendance } =
  require("../controllers/teacher.attendance.controller");

router.get(
  "/class",
  authenticate,
  authorize("teacher", "admin"),
  getClassAttendance
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
   STUDENT: Download PDF
========================= */
router.get(
  "/pdf",
  authenticate,
  authorize("student"),
  downloadMyAttendancePDF
);

/* =========================
   TEACHER: Class PDF
========================= */
router.get(
  "/teacher/pdf",
  authenticate,
  authorize("teacher", "admin"),
  exportTeacherAttendancePDF
);

module.exports = router;
