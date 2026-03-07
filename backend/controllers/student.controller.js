const db = require("../config/db");

/**
 * Student Controller
 * Assumes JWT middleware sets req.user = { id, role }
 */

/* ================= PROFILE ================= */

// GET /api/student/profile
const getProfile = (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found. Authentication required."
      });
    }

    const query = `
      SELECT
        u.id AS user_id,
        u.name,
        u.email,
        u.role,
        u.created_at,
        s.id AS student_id,
        s.department,
        s.year,
        s.roll_no
      FROM users u
      LEFT JOIN students s ON s.user_id = u.id
      WHERE u.id = ?
      LIMIT 1
    `;

    db.query(query, [userId], (err, rows) => {
      if (err) {
        console.error("Error fetching student profile:", err);
        return res.status(500).json({
          success: false,
          message: "Database error while fetching profile"
        });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const r = rows[0];

      return res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        user: {
          id: r.user_id,
          name: r.name,
          email: r.email,
          role: r.role,
          created_at: r.created_at
        },
        student: r.student_id
          ? {
              id: r.student_id,
              user_id: r.user_id,
              department: r.department,
              year: r.year,
              roll_no: r.roll_no
            }
          : null
      });
    });
  } catch (error) {
    console.error("Get student profile controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// PUT /api/student/profile
const updateProfile = (req, res) => {
  try {
    const userId = req.user?.id;
    const { department, year, roll_no } = req.body || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!department || !year || !roll_no) {
      return res.status(400).json({
        success: false,
        message: "department, year, roll_no required"
      });
    }

    db.query(
      "SELECT id FROM students WHERE user_id = ? LIMIT 1",
      [userId],
      (err, rows) => {
        if (err) return res.status(500).json(err);

        const exists = rows.length > 0;

        const query = exists
          ? "UPDATE students SET department=?, year=?, roll_no=? WHERE user_id=?"
          : "INSERT INTO students (department, year, roll_no, user_id) VALUES (?,?,?,?)";

        const params = exists
          ? [department, year, roll_no, userId]
          : [department, year, roll_no, userId];

        db.query(query, params, err2 => {
          if (err2) return res.status(500).json(err2);
          getProfile(req, res);
        });
      }
    );
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false });
  }
};

/* ================= DASHBOARD ================= */

// GET /api/student/dashboard/:id
/* ================= DASHBOARD ================= */

/* ================= DASHBOARD ================= */

const getDashboard = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT 
      COUNT(DISTINCT e.course_id) AS totalCourses,
      IFNULL(ROUND(AVG(g.gpa), 2), 0) AS cgpa,
      IFNULL(
        ROUND(
          SUM(CASE WHEN a.status = 'P' THEN 1 ELSE 0 END) 
          / NULLIF(COUNT(a.id), 0) * 100,
          2
        ), 
      0) AS attendance
    FROM students s
    LEFT JOIN enrollments e ON e.student_id = s.id
    LEFT JOIN grades g ON g.student_id = s.id
    LEFT JOIN attendance a ON a.student_id = s.id
    WHERE s.user_id = ?
  `;

  db.query(query, [userId], (err, rows) => {
    if (err) {
      console.error("Dashboard error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to load dashboard"
      });
    }

    const data = rows[0] || {};

    res.json({
      courses: data.totalCourses || 0,
      cgpa: data.cgpa || 0,
      attendance: data.attendance || 0
    });
  });
};
const getGrades = (req, res) => {
  const studentId = req.params.id;

  const query = `
    SELECT subject, marks, gpa, semester, created_at
    FROM grades
    WHERE id = ?
    ORDER BY created_at DESC
  `;

  db.query(query, [studentId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

const getCourses = (req, res) => {
  const studentId = req.params.id;

  const query = `
    SELECT id, name, code
    FROM courses
    WHERE id = ?
  `;

  db.query(query, [studentId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};
const getAttendance = (req, res) => {
  const studentId = req.params.id;

  const query = `
    SELECT date, status
    FROM attendance
    WHERE id = ?
    ORDER BY date DESC
  `;

  db.query(query, [studentId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};





/* ================= EXPORT ================= */

module.exports = {
  getProfile,
  updateProfile,
  getDashboard,
  getGrades,
  getCourses,
  getAttendance
};

