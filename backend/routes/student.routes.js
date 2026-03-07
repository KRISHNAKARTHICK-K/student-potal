const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const studentController = require("../controllers/student.controller");
const { getStudentCourses } = require("../controllers/course.controller");
const { getMyAttendance } = require("../controllers/attendance.controller");
const { getStudentTimetable } = require("../controllers/timetable.controller");

/* ==============================
   STUDENT PROFILE
============================== */
router.get(
  "/profile",
  authenticate,
  role(["student"]),
  studentController.getProfile
);

router.put(
  "/profile",
  authenticate,
  role(["student"]),
  studentController.updateProfile
);

/* ==============================
   STUDENT DASHBOARD
============================== */
router.get(
  "/dashboard",
  authenticate,
  role(["student"]),
  studentController.getDashboard
);

/* ==============================
   STUDENT COURSES
   GET /api/student/courses
============================== */
router.get(
  "/courses",
  authenticate,
  role(["student"]),
  getStudentCourses
);

/* ==============================
   STUDENT ATTENDANCE
============================== */
router.get(
  "/attendance",
  authenticate,
  role(["student"]),
  getMyAttendance
);

/* ==============================
   STUDENT TIMETABLE
============================== */
router.get(
  "/timetable",
  authenticate,
  role(["student"]),
  getStudentTimetable
);

module.exports = router;