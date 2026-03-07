const db = require("../config/db");

/* ==============================
   GET STUDENTS IN COURSE
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
        message: "Failed to fetch students"
      });
    }

    res.json({
      success: true,
      students: rows
    });
  });
};

/* ==============================
   MARK ATTENDANCE
============================== */
const markAttendance = (req, res) => {
  const teacherId = req.user.id;
  const { student_id, course_id, date, status } = req.body;

  if (!student_id || !course_id || !status) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  if (!["present", "absent"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be present or absent"
    });
  }

  const query = `
    INSERT INTO attendance (student_id, course_id, date, status, marked_by)
    VALUES (?, ?, CURDATE(), ?, ?)
    ON DUPLICATE KEY UPDATE
      status = VALUES(status),
      marked_by = VALUES(marked_by),
      date = CURDATE()
  `;

  db.query(
    query,
    [student_id, course_id, status, teacherId],
    (err) => {
      if (err) {
        console.error("Attendance upsert error:", err);
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

/* ==============================
   COURSE ATTENDANCE SUMMARY
============================== */
const getAttendanceSummary = (req, res) => {
  const teacherId = req.user.id;

  const query = `
    SELECT 
      c.id,
      c.name,
      COUNT(a.id) AS total,
      SUM(a.status='present') AS present,
      SUM(a.status='absent') AS absent
    FROM courses c
    LEFT JOIN attendance a ON a.course_id = c.id
    WHERE c.teacher_id = ?
    GROUP BY c.id
  `;

  db.query(query, [teacherId], (err, rows) => {
    if (err) {
      console.error("Summary error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to load summary"
      });
    }

    res.json({
      success: true,
      summary: rows
    });
  });
};

/* ==============================
   TEACHER DASHBOARD
============================== */
const getDashboard = (req, res) => {
  const teacherId = req.user.id;

  const query = `
    SELECT
      (SELECT COUNT(*) FROM courses WHERE teacher_id=?) AS courses,
      (SELECT COUNT(*) FROM enrollments e 
         JOIN courses c ON c.id=e.course_id
         WHERE c.teacher_id=?) AS students,
      (SELECT COUNT(*) FROM attendance 
         WHERE marked_by=?) AS attendanceMarked
  `;

  db.query(query, [teacherId, teacherId, teacherId], (err, rows) => {
    if (err) {
      console.error("Dashboard error:", err);
      return res.status(500).json({
        success: false,
        message: "Dashboard failed"
      });
    }

    res.json({
      success: true,
      dashboard: rows[0]
    });
  });
};

module.exports = {
  getStudentsForCourse,
  markAttendance,
  getAttendanceSummary,
  getDashboard
};
