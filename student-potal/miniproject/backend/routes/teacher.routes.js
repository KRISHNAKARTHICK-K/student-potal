const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middleware/auth.middleware");
const { getTeacherCourses } = require("../controllers/course.controller");
const { getStudentsForCourse } = require("../controllers/teacher.controller");

// TEACHER: assigned courses
// GET /api/teacher/courses
router.get(
  "/courses",
  authenticate,
  authorize("teacher", "admin"),
  getTeacherCourses
);

// TEACHER: students for a given course
// GET /api/teacher/students?courseId=
router.get(
  "/students",
  authenticate,
  authorize("teacher", "admin"),
  getStudentsForCourse
);

module.exports = router;

