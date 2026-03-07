const db = require("../config/db");

/* ============================
   TEACHER: Mark attendance
   date is AUTO from DB
============================ */
const markAttendance = (req, res) => {
  const teacherId = req.user.id;
  const { student_id, course_id, status } = req.body;

  if (!student_id || !course_id || !status) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  const query = `
    INSERT INTO attendance 
    (student_id, course_id, status, marked_by, attendance_date)
    VALUES (?, ?, ?, ?, CURDATE())
    ON DUPLICATE KEY UPDATE
      status = VALUES(status),
      marked_by = VALUES(marked_by)
  `;

  db.query(
    query,
    [student_id, course_id, status, teacherId],
    (err) => {
      if (err) {
        console.error("Attendance error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to mark attendance"
        });
      }

      res.json({
        success: true,
        message: "Attendance saved or updated successfully"
      });
    }
  );
};

/* ============================
   STUDENT: View own attendance
============================ */
const getMyAttendance = (req, res) => {
  try {
    const student_id = req.user.id;

    const query = `
      SELECT 
        a.id,
        c.name AS course,
        DATE(a.created_at) AS date,
        a.status
      FROM attendance a
      JOIN courses c ON c.id = a.course_id
      WHERE a.student_id = ?
      ORDER BY a.created_at DESC
    `;

    db.query(query, [student_id], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Fetch failed"
        });
      }

      const total = rows.length;
      const present = rows.filter(r => r.status === "present").length;
      const absent = rows.filter(r => r.status === "absent").length;

      const percentage =
        total > 0 ? ((present / total) * 100).toFixed(1) : 0;

      res.json({
        success: true,
        summary: { total, present, absent, percentage },
        attendance: rows
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server crash"
    });
  }
};
/* ============================
   TEACHER: Class Attendance Summary
============================ */
const getClassAttendanceSummary = (req, res) => {
  try {
    const teacherId = req.user.id;
    const { course_id, year } = req.query;

    if (!course_id || !year) {
      return res.status(400).json({
        success: false,
        message: "course_id and year are required"
      });
    }

   const query = `
  SELECT 
    u.id AS student_id,
    u.name,
    s.roll_no,
    COUNT(a.id) AS total,
    SUM(a.status = 'present') AS present,
    SUM(a.status = 'absent') AS absent
  FROM enrollments e
  JOIN users u ON u.id = e.student_id
  JOIN students s ON s.user_id = u.id
  LEFT JOIN attendance a 
    ON a.student_id = u.id
    AND a.course_id = e.course_id
  JOIN teacher_courses tc 
    ON tc.course_id = e.course_id
  WHERE e.course_id = ?
    AND s.year = ?
    AND tc.teacher_id = ?
  GROUP BY u.id, u.name, s.roll_no
  ORDER BY u.name ASC
`;


    db.query(query, [course_id, year, teacherId], (err, rows) => {
      if (err) {
        console.error("SQL ERROR:", err);
        return res.status(500).json({
          success: false,
          message: "Database crash",
          error: err.message
        });
      }

      const students = rows.map(r => {
        const percent =
          r.total > 0
            ? ((r.present / r.total) * 100).toFixed(1)
            : 0;

        return {
          ...r,
          percentage: percent
        };
      });

      res.json({ success: true, students });
    });
  } catch (error) {
    console.error("SERVER CRASH:", error);
    res.status(500).json({
      success: false,
      message: "Server crash"
    });
  }
};




module.exports = {
  markAttendance,
  getMyAttendance,
  getClassAttendanceSummary
};

