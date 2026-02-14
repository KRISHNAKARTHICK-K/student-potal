const db = require("../config/db");


/**
 * Student Controller
 * - Assumes JWT middleware sets req.user = { id, role }
 */

// GET /api/student/profile
// Fetch user + student details for the authenticated user (excludes password)
const getProfile = (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found. Authentication required.'
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
        console.error('Error fetching student profile:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error while fetching profile'
        });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const r = rows[0];

      return res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
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
    console.error('Get student profile controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// PUT /api/student/profile
// Update (or create) student profile fields for the authenticated user
const updateProfile = (req, res) => {
  try {
    const userId = req.user?.id;
    const { department, year, roll_no } = req.body || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found. Authentication required.'
      });
    }

    if (!department || year === undefined || year === null || !roll_no) {
      return res.status(400).json({
        success: false,
        message: 'department, year, and roll_no are required'
      });
    }

    const yearNumber = Number(year);
    if (!Number.isInteger(yearNumber) || yearNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: 'year must be a positive integer'
      });
    }

    // Check if a student row already exists for this user
    db.query(
      'SELECT id FROM students WHERE user_id = ? LIMIT 1',
      [userId],
      (err, rows) => {
        if (err) {
          console.error('Error checking student row:', err);
          return res.status(500).json({
            success: false,
            message: 'Database error while updating profile'
          });
        }

        const exists = rows && rows.length > 0;

        const doWrite = (writeQuery, params) => {
          db.query(writeQuery, params, (err2) => {
            if (err2) {
              console.error('Error writing student profile:', err2);
              return res.status(500).json({
                success: false,
                message: 'Database error while updating profile'
              });
            }

            // Return the latest profile after update
            return getProfile(req, res);
          });
        };

        if (exists) {
          return doWrite(
            'UPDATE students SET department = ?, year = ?, roll_no = ? WHERE user_id = ?',
            [String(department).trim(), yearNumber, String(roll_no).trim(), userId]
          );
        }

        return doWrite(
          'INSERT INTO students (user_id, department, year, roll_no) VALUES (?, ?, ?, ?)',
          [userId, String(department).trim(), yearNumber, String(roll_no).trim()]
        );
      }
    );
  } catch (error) {
    console.error('Update student profile controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = { getProfile, updateProfile };

