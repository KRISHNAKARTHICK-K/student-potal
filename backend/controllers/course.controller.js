const db = require("../config/db");

/* ==============================
   TEACHER: Get assigned courses
   GET /api/teacher/courses
============================== */
const getTeacherCourses = (req, res) => {
  const teacherId = req.user.id;

  const query = `
    SELECT 
      c.id,
      c.name,
      c.code,
      c.department,
      c.semester
    FROM courses c
    WHERE c.teacher_id = ?
    ORDER BY c.semester, c.name
  `;

  db.query(query, [teacherId], (err, rows) => {
    if (err) {
      console.error("Error fetching teacher courses:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch teacher courses"
      });
    }

    return res.json({
      success: true,
      courses: rows
    });
  });
};

/* ==============================
   STUDENT: Get enrolled courses
   GET /api/student/courses
============================== */
const getStudentCourses = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT 
      c.id,
      c.name,
      c.code,
      c.teacher_id,
      u.name AS teacher_name
    FROM enrollments e
    JOIN students s ON s.id = e.student_id
    JOIN courses c ON c.id = e.course_id
    LEFT JOIN users u ON u.id = c.teacher_id
    WHERE s.user_id = ?
  `;

  db.query(query, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching student courses:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch student courses"
      });
    }

    return res.json({
      success: true,
      courses: rows
    });
  });
};

/* ==============================
   ADMIN: Courses CRUD
   /api/admin/courses
============================== */
const getAllCourses = (req, res) => {
  const query = `
    SELECT 
      c.id,
      c.name,
      c.code,
      c.department,
      c.semester,
      c.teacher_id,
      u.name AS teacher_name
    FROM courses c
    LEFT JOIN users u ON u.id = c.teacher_id
    ORDER BY c.id DESC
  `;

  db.query(query, (err, rows) => {
    if (err) {
      console.error("Error fetching courses:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch courses"
      });
    }

    return res.json({
      success: true,
      courses: rows
    });
  });
};

const createCourse = (req, res) => {
  const { name, teacher_id, department, semester, code } = req.body;

  if (!name || !department || !semester || !code) {
    return res.status(400).json({
      success: false,
      message: "name, code, department and semester are required"
    });
  }

  const query = `
    INSERT INTO courses (name, code, teacher_id, department, semester)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name.trim(), code.trim(), teacher_id || null, department.trim(), semester],
    (err, result) => {
      if (err) {
        console.error("Error creating course:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to create course"
        });
      }

      return res.status(201).json({
        success: true,
        message: "Course created successfully",
        id: result.insertId
      });
    }
  );
};

const updateCourse = (req, res) => {
  const { id } = req.params;
  const { name, teacher_id, department, semester, code } = req.body;

  const query = `
    UPDATE courses
    SET name = ?, code = ?, teacher_id = ?, department = ?, semester = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [name, code, teacher_id || null, department, semester, id],
    (err, result) => {
      if (err) {
        console.error("Error updating course:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to update course"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }

      return res.json({
        success: true,
        message: "Course updated successfully"
      });
    }
  );
};

const deleteCourse = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM courses WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting course:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to delete course"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }

      return res.json({
        success: true,
        message: "Course deleted successfully"
      });
    }
  );
};

module.exports = {
  getTeacherCourses,
  getStudentCourses,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse
};