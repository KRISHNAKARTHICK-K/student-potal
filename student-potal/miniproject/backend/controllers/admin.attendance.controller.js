const db = require("../config/db");

// ADMIN / TEACHER: View attendance + summary
const getStudentAttendance = (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID required"
      });
    }

    const query = `
      SELECT 
        a.date,
        a.status,
        u.name,
        s.roll_no,
        s.department,
        s.year
      FROM attendance a
      JOIN users u ON u.id = a.student_id
      LEFT JOIN students s ON s.user_id = u.id
      WHERE a.student_id = ?
      ORDER BY a.date DESC
    `;

    db.query(query, [studentId], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch attendance"
        });
      }

      // ✅ Calculate summary
      const total = rows.length;
      const present = rows.filter(r => r.status === "present").length;
      const absent = rows.filter(r => r.status === "absent").length;
      const percentage =
        total > 0 ? ((present / total) * 100).toFixed(1) : 0;

      return res.json({
        success: true,
        studentId,
        summary: {
          total,
          present,
          absent,
          percentage
        },
        attendance: rows
      });
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  getStudentAttendance
};
