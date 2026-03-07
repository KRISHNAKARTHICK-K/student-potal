const db = require("../config/db");

// TEACHER → Get courses assigned to teacher
const getTeacherCourses = (req, res) => {
  const teacherId = req.user.id;

  const query = `
    SELECT 
      c.id,
      c.name,
      c.code
    FROM teacher_courses tc
    JOIN courses c ON c.id = tc.course_id
    WHERE tc.teacher_id = ?
  `;

  db.query(query, [teacherId], (err, rows) => {
    if (err) {
      console.error("Teacher courses error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch teacher courses"
      });
    }

    res.json({
      success: true,
      courses: rows
    });
  });
};

module.exports = { getTeacherCourses };
