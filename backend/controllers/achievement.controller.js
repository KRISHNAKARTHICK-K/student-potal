const db = require("../config/db");
const xpService = require('../services/xp.service');
const fs = require('fs');
const logPath = 'c:\\Users\\Krishna Karthick\\OneDrive\\Desktop\\project\\.cursor\\debug.log';

// Promisify query function for async/await
// mysql2 returns [rows, fields] but we only need rows
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        // mysql2 returns results directly, not [rows, fields] unless using promise wrapper
        // But our db.js uses createConnection, so results is already the rows array
        resolve(results);
      }
    });
  });
};

/**
 * Create a new achievement (Student only)
 */
const createAchievement = async (req, res) => {
  try {
    const { title, description, category_id, certificate_url, certificate_file_path, date_achieved } = req.body;
    const studentId = req.user.id;

    // Validation
    if (!title || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Title and category are required'
      });
    }

    // Verify category exists
    const [category] = await query(
      'SELECT id FROM achievement_categories WHERE id = ?',
      [category_id]
    );

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    // Insert achievement
    const result = await query(
      `INSERT INTO achievements 
       (student_id, title, description, category_id, certificate_url, certificate_file_path, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        studentId,
        title,
        description || null,
        category_id,
        certificate_url || null,
        certificate_file_path || null,
        date_achieved ? new Date(date_achieved) : new Date()
      ]
    );

    // Get the created achievement
    const [achievement] = await query(
      `SELECT 
        a.*,
        ac.name as category_name,
        ac.icon as category_icon,
        ac.color as category_color,
        u.name as student_name
       FROM achievements a
       JOIN achievement_categories ac ON a.category_id = ac.id
       JOIN users u ON a.student_id = u.id
       WHERE a.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Achievement submitted successfully',
      achievement
    });
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create achievement',
      error: error.message
    });
  }
};

/**
 * Get student's own achievements
 */
const getMyAchievements = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { status, category_id } = req.query;

    let sql = `
      SELECT 
        a.*,
        ac.name as category_name,
        ac.icon as category_icon,
        ac.color as category_color
      FROM achievements a
      JOIN achievement_categories ac ON a.category_id = ac.id
      WHERE a.student_id = ?
    `;
    const params = [studentId];

    if (status) {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    if (category_id) {
      sql += ' AND a.category_id = ?';
      params.push(category_id);
    }

    sql += ' ORDER BY a.created_at DESC';

    const achievements = await query(sql, params);

    res.json({
      success: true,
      achievements
    });
  } catch (error) {
    console.error('Error getting achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements',
      error: error.message
    });
  }
};

/**
 * Get pending achievements (Admin only)
 */
const getPendingAchievements = async (req, res) => {
  try {
    const achievements = await query(
      `SELECT 
        a.*,
        ac.name as category_name,
        ac.icon as category_icon,
        ac.color as category_color,
        u.name as student_name,
        u.email as student_email
      FROM achievements a
      JOIN achievement_categories ac ON a.category_id = ac.id
      JOIN users u ON a.student_id = u.id
      WHERE a.status = 'pending'
      ORDER BY a.created_at ASC`
    );

    res.json({
      success: true,
      achievements
    });
  } catch (error) {
    console.error('Error getting pending achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending achievements',
      error: error.message
    });
  }
};

/**
 * Verify achievement (Approve/Reject) - Admin only
 */
const verifyAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, xp, rejection_reason } = req.body;
    const adminId = req.user.id;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be "approve" or "reject"'
      });
    }

    // Get achievement
    const [achievement] = await query(
      'SELECT * FROM achievements WHERE id = ?',
      [id]
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    if (achievement.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Achievement already processed'
      });
    }

    if (action === 'approve') {
      // Validate XP
      const xpAmount = parseInt(xp) || 0;
      if (xpAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'XP must be greater than 0'
        });
      }

      // Update achievement
      await query(
        `UPDATE achievements 
         SET status = 'approved', 
             xp = ?,
             verified_by = ?,
             verified_at = NOW()
         WHERE id = ?`,
        [xpAmount, adminId, id]
      );

      // Add XP to student
      await xpService.addXP(
        achievement.student_id,
        xpAmount,
        id,
        'achievement',
        `Approved achievement: ${achievement.title}`
      );

      res.json({
        success: true,
        message: 'Achievement approved and XP awarded'
      });
    } else {
      // Reject achievement
      await query(
        `UPDATE achievements 
         SET status = 'rejected',
             verified_by = ?,
             verified_at = NOW(),
             rejection_reason = ?
         WHERE id = ?`,
        [adminId, rejection_reason || null, id]
      );

      res.json({
        success: true,
        message: 'Achievement rejected'
      });
    }
  } catch (error) {
    console.error('Error verifying achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify achievement',
      error: error.message
    });
  }
};

/**
 * Get achievement analytics for student
 */
const getAnalytics = async (req, res) => {
  try {
    const studentId = req.user.id;

    // XP by category (Pie chart data)
    const xpByCategory = await query(
      `SELECT 
        ac.name as category,
        ac.color,
        ac.icon,
        COALESCE(SUM(a.xp), 0) as total_xp,
        COUNT(a.id) as count
      FROM achievement_categories ac
      LEFT JOIN achievements a ON ac.id = a.category_id 
        AND a.student_id = ? 
        AND a.status = 'approved'
      GROUP BY ac.id, ac.name, ac.color, ac.icon
      ORDER BY total_xp DESC`,
      [studentId]
    );

    // Achievements per month (Bar chart data)
    const achievementsPerMonth = await query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'approved' THEN xp ELSE 0 END) as total_xp
      FROM achievements
      WHERE student_id = ?
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12`,
      [studentId]
    );

    // Skill strengths (Radar chart data)
    const skillStrengths = await query(
      `SELECT 
        ac.name as skill,
        COUNT(a.id) as achievements,
        COALESCE(SUM(a.xp), 0) as total_xp,
        AVG(CASE WHEN a.xp > 0 THEN a.xp ELSE NULL END) as avg_xp
      FROM achievement_categories ac
      LEFT JOIN achievements a ON ac.id = a.category_id 
        AND a.student_id = ? 
        AND a.status = 'approved'
      GROUP BY ac.id, ac.name
      ORDER BY total_xp DESC`,
      [studentId]
    );

    // Get student XP summary
    const xpSummary = await xpService.getStudentXP(studentId);
    const badges = await xpService.getStudentBadges(studentId);

    res.json({
      success: true,
      analytics: {
        xpByCategory,
        achievementsPerMonth,
        skillStrengths,
        xpSummary,
        badges
      }
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

/**
 * Get all categories
 */
const getCategories = async (req, res) => {
  try {
    let result;

    try {
      result = await query(
        "SELECT * FROM achievement_categories ORDER BY name"
      );
    } catch (err) {
      if (err.code === "ER_NO_SUCH_TABLE") {
        console.log("⚠️ Table missing. Creating achievement_categories...");

        await query(`
          CREATE TABLE achievement_categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) UNIQUE,
            icon VARCHAR(10),
            color VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        result = [[]]; // empty rows after creation
      } else {
        throw err;
      }
    }

    // mysql2 returns [rows, fields]
    const rows = Array.isArray(result) && Array.isArray(result[0])
      ? result[0]
      : result;

    // If empty → seed
    if (!rows || rows.length === 0) {
      console.log("⚡ Auto seeding categories...");

      const defaults = [
        ["Sports", "⚽", "#10b981"],
        ["Coding", "💻", "#3b82f6"],
        ["Research", "🔬", "#8b5cf6"],
        ["Hackathon", "🏆", "#f59e0b"],
        ["Leadership", "👑", "#ec4899"],
        ["Academics", "📚", "#06b6d4"],
        ["Arts", "🎨", "#f97316"],
        ["Community Service", "🤝", "#14b8a6"]
      ];

      for (const c of defaults) {
        await query(
          "INSERT IGNORE INTO achievement_categories (name, icon, color) VALUES (?, ?, ?)",
          c
        );
      }

      const seeded = await query(
        "SELECT * FROM achievement_categories ORDER BY name"
      );

      const seededRows = Array.isArray(seeded) && Array.isArray(seeded[0])
        ? seeded[0]
        : seeded;

      return res.json({
        success: true,
        categories: seededRows
      });
    }

    return res.json({
      success: true,
      categories: rows
    });

  } catch (error) {
    console.error("❌ getCategories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories"
    });
  }
};

/**
 * Get leaderboard
 */
const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await xpService.getLeaderboard(limit);

    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
};

module.exports = {
  createAchievement,
  getMyAchievements,
  getPendingAchievements,
  verifyAchievement,
  getAnalytics,
  getCategories,
  getLeaderboard
};
