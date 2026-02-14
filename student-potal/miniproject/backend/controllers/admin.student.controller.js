const db = require("../config/db");

/* ==============================
   GET ALL STUDENTS (ADMIN)
============================== */
const getAllStudents = (req, res) => {
  const query = `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.role,
      s.department,
      s.year,
      s.roll_no
    FROM users u
    LEFT JOIN students s ON s.user_id = u.id
    WHERE u.role = 'student'
    ORDER BY u.id DESC
  `;

  db.query(query, (err, rows) => {
    if (err) {
      console.error("DB ERROR:", err);
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
   GET STUDENTS BY CLASS
   (TEACHER + ADMIN)
============================== */
const getStudentsByClass = (req, res) => {
  const { department, year } = req.query;

  let query = `
    SELECT 
      u.id,
      u.name,
      s.roll_no,
      s.department,
      s.year
    FROM users u
    JOIN students s ON s.user_id = u.id
    WHERE u.role = 'student'
  `;

  const params = [];

  if (department) {
    query += " AND s.department = ?";
    params.push(department);
  }

  if (year) {
    query += " AND s.year = ?";
    params.push(year);
  }

  query += " ORDER BY u.name ASC";

  db.query(query, params, (err, rows) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch students by class"
      });
    }

    res.json({
      success: true,
      students: rows
    });
  });
};

/* ==============================
   UPDATE STUDENT ACADEMIC INFO
   (ADMIN)
============================== */
const updateStudentAcademic = (req, res) => {
  const { userId } = req.params;
  const { department, year, roll_no } = req.body;

  if (!department || !year || !roll_no) {
    return res.status(400).json({
      success: false,
      message: "department, year and roll_no are required"
    });
  }

  const query = `
    UPDATE students
    SET department = ?, year = ?, roll_no = ?
    WHERE user_id = ?
  `;

  db.query(query, [department, year, roll_no, userId], (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to update student"
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({
      success: true,
      message: "Student updated successfully"
    });
  });
};

/* ==============================
   EXPORTS
============================== */
module.exports = {
  getAllStudents,
  getStudentsByClass,
  updateStudentAcademic
};
