const bcrypt = require('bcryptjs');
const db = require('../db');

// Register controller
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate all fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, email, password, and role'
      });
    }

    // Validate name (at least 2 characters)
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password (at least 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Validate role
    const validRoles = ['student', 'teacher', 'admin'];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Role must be one of: student, teacher, admin'
      });
    }

    // Check if email already exists
    const checkEmailQuery = 'SELECT id FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], async (err, results) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error while checking email'
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert user into database
      const insertQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(
        insertQuery,
        [name.trim(), email.toLowerCase().trim(), hashedPassword, role.toLowerCase()],
        (err, results) => {
          if (err) {
            console.error('Error inserting user:', err);
            
            // Handle duplicate email error (in case of race condition)
            if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
              return res.status(409).json({
                success: false,
                message: 'Email already exists'
              });
            }

            return res.status(500).json({
              success: false,
              message: 'Error creating user account'
            });
          }

          // Success response
          res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
              id: results.insertId,
              name: name.trim(),
              email: email.toLowerCase().trim(),
              role: role.toLowerCase()
            }
          });
        }
      );
    });
  } catch (error) {
    console.error('Register controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = { register };
