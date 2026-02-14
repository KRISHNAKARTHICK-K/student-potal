const db = require("../config/db");

/* ==============================
   TEACHER: Get students in course
   GET /api/teacher/students?courseId=
============================== */
const getStudentsForCourse = (req, res) => {
  const teacherId = req.user.id;
  const { courseId } = req.query || {};

  if (!courseId) {
    return res.status(400).json({
      success: false,
      message: "courseId query parameter is required"
    });
  }

  const query = `
    SELECT 
      u.id,
      u.name,
      s.roll_no,
      s.department,
      s.year
    FROM enrollments e
    JOIN users u ON u.id = e.student_id
    LEFT JOIN students s ON s.user_id = u.id
    JOIN courses c ON c.id = e.course_id
    WHERE e.course_id = ?
      AND c.teacher_id = ?
    ORDER BY u.name ASC
  `;

  db.query(query, [courseId, teacherId], (err, rows) => {
    if (err) {
      console.error("Error fetching course students:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch students for course"
      });
    }

    return res.json({
      success: true,
      students: rows
    });
  });
};

module.exports = {
  getStudentsForCourse
};

