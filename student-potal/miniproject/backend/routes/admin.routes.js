const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middleware/auth.middleware");

const {
  getAllStudents,
  updateStudentAcademic,
  getStudentsByClass   // ✅ added import
} = require("../controllers/admin.student.controller");

const {
  getStudentAttendance
} = require("../controllers/admin.attendance.controller");

const {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/course.controller");

// ==========================
// TEST ADMIN ROUTE
// ==========================
router.get(
  "/test",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

// ==========================
// VIEW ALL STUDENTS
// ==========================
router.get(
  "/students",
  authenticate,
  authorize("admin"),
  getAllStudents
);

// ==========================
// GET STUDENTS BY CLASS
// ==========================
router.get(
  "/students/class",
  authenticate,
  authorize("teacher", "admin"),
  getStudentsByClass
);

// ==========================
// VIEW STUDENT ATTENDANCE
// ==========================
router.get(
  "/attendance/:studentId",
  authenticate,
  authorize("admin"),
  getStudentAttendance
);

// ==========================
// UPDATE STUDENT DETAILS
// ==========================
router.put(
  "/students/:userId",
  authenticate,
  authorize("admin"),
  updateStudentAcademic
);

// ==========================
// COURSES CRUD
// ==========================
router.get(
  "/courses",
  authenticate,
  authorize("admin"),
  getAllCourses
);

router.post(
  "/courses",
  authenticate,
  authorize("admin"),
  createCourse
);

router.put(
  "/courses/:id",
  authenticate,
  authorize("admin"),
  updateCourse
);

router.delete(
  "/courses/:id",
  authenticate,
  authorize("admin"),
  deleteCourse
);

module.exports = router;
