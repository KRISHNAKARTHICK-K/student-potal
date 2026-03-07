const db = require("../config/db");

// TEACHER: View class attendance summary for a specific course
const getClassAttendance = (req, res) => {
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
      a.student_id,
      u.name,
      s.roll_no,
      COUNT(a.id) AS total,
      SUM(a.status = 'present') AS present,
      SUM(a.status = 'absent') AS absent
    FROM attendance a
    JOIN users u ON u.id = a.student_id
    LEFT JOIN students s ON s.user_id = u.id
    JOIN courses c ON c.id = a.course_id
    WHERE a.course_id = ?
      AND c.teacher_id = ?
    GROUP BY a.student_id, u.name, s.roll_no
    ORDER BY u.name ASC
  `;

  db.query(query, [courseId, teacherId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch class attendance"
      });
    }

    return res.json({
      success: true,
      data: rows
    });
  });
};

module.exports = { getClassAttendance };
