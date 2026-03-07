const db = require("../config/db");

/* ==============================
   TEACHER: Recent Activity
============================== */
const getTeacherActivity = (req, res) => {
  const teacherId = req.user.id;

  const query = `
    SELECT 
      a.id,
      c.name AS course,
      DATE(a.created_at) AS date,
      a.status,
      u.name AS student_name
    FROM attendance a
    JOIN courses c ON c.id = a.course_id
    JOIN users u ON u.id = a.student_id
    WHERE a.marked_by = ?
    ORDER BY a.created_at DESC
    LIMIT 10
  `;

  db.query(query, [teacherId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch activity"
      });
    }

    res.json({
      success: true,
      activity: rows
    });
  });
};

module.exports = { getTeacherActivity };
