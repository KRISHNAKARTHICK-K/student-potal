const db = require("../config/db");

/* ==============================
   STUDENT: Timetable
   GET /api/student/timetable
============================== */
const getStudentTimetable = (req, res) => {
  const studentId = req.user.id;

  const query = `
    SELECT 
      t.id,
      t.day,
      t.time,
      t.room,
      c.id AS course_id,
      c.name AS course_name,
      c.department,
      c.semester
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    JOIN timetable t ON t.course_id = c.id
    WHERE e.student_id = ?
    ORDER BY 
      FIELD(t.day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
      t.time
  `;

  db.query(query, [studentId], (err, rows) => {
    if (err) {
      console.error("Error fetching student timetable:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch timetable"
      });
    }

    return res.json({
      success: true,
      timetable: rows
    });
  });
};

module.exports = {
  getStudentTimetable
};

