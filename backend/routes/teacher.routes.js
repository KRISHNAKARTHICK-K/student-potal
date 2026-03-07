const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middleware/auth.middleware");

const {
  getTeacherCourses
} = require("../controllers/course.controller");
const { getTeacherActivity } =
  require("../controllers/teacher.activity.controller");

const {
  getStudentsForCourse,
  markAttendance,
  getAttendanceSummary,
  getDashboard
} = require("../controllers/teacher.controller");

/* ============================
   TEACHER COURSES
============================ */
router.get(
  "/courses",
  authenticate,
  authorize("teacher", "admin"),
  getTeacherCourses
);

/* ============================
   STUDENTS IN COURSE
============================ */
router.get(
  "/students",
  authenticate,
  authorize("teacher", "admin"),
  getStudentsForCourse
);

/* ============================
   MARK ATTENDANCE
============================ */
router.post(
  "/attendance/mark",
  authenticate,
  authorize("teacher", "admin"),
  markAttendance
);

/* ============================
   ATTENDANCE SUMMARY
============================ */
router.get(
  "/attendance/summary",
  authenticate,
  authorize("teacher", "admin"),
  getAttendanceSummary
);

/* ============================
   TEACHER DASHBOARD
============================ */
router.get(
  "/dashboard",
  authenticate,
  authorize("teacher", "admin"),
  getDashboard
);
router.get(
  "/activity",
  authenticate,
  authorize("teacher", "admin"),
  getTeacherActivity
);

module.exports = router;
