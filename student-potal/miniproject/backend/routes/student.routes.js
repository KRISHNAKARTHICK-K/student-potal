const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const studentController = require("../controllers/student.controller");
const { getStudentCourses } = require("../controllers/course.controller");
const { getMyAttendance } = require("../controllers/attendance.controller");
const { getStudentTimetable } = require("../controllers/timetable.controller");

// GET student profile
router.get("/profile", authenticate, role(["student"]), studentController.getProfile);

// UPDATE student profile
router.put("/profile", authenticate, role(["student"]), studentController.updateProfile);

// STUDENT: enrolled courses
// GET /api/student/courses
router.get("/courses", authenticate, role(["student"]), getStudentCourses);

// STUDENT: attendance per course
// GET /api/student/attendance?courseId=
router.get("/attendance", authenticate, role(["student"]), getMyAttendance);

// STUDENT: timetable from enrolled courses
// GET /api/student/timetable
router.get("/timetable", authenticate, role(["student"]), getStudentTimetable);

module.exports = router;
