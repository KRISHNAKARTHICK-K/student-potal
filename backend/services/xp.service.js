/**
 * XP Service - Handles XP calculations, level progression, and badge awarding
 */

const db = require('../config/db');

// Promisify query function for async/await
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Level progression formula: XP required = 100 * level^1.5
const calculateXPForLevel = (level) => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

const calculateLevelFromXP = (totalXP) => {
  let level = 1;
  let xpNeeded = 0;
  
  while (true) {
    const xpForNextLevel = calculateXPForLevel(level);
    if (totalXP < xpNeeded + xpForNextLevel) {
      break;
    }
    xpNeeded += xpForNextLevel;
    level++;
  }
  
  return {
    level,
    levelXP: totalXP - xpNeeded,
    nextLevelXP: calculateXPForLevel(level)
  };
};

/**
 * Add XP to student and update their level
 */
const addXP = async (studentId, xpAmount, achievementId = null, source = 'achievement', description = '') => {
  try {
    // Insert XP log
    await query(
      `INSERT INTO xp_log (student_id, achievement_id, xp_amount, source, description) 
       VALUES (?, ?, ?, ?, ?)`,
      [studentId, achievementId, xpAmount, source, description]
    );

    // Get current XP
    const [currentXP] = await query(
      'SELECT total_xp FROM student_xp WHERE student_id = ?',
      [studentId]
    );

    const newTotalXP = (currentXP?.total_xp || 0) + xpAmount;
    const levelData = calculateLevelFromXP(newTotalXP);

    // Update or insert student XP
    await query(
      `INSERT INTO student_xp (student_id, total_xp, current_level, level_xp, next_level_xp)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       total_xp = VALUES(total_xp),
       current_level = VALUES(current_level),
       level_xp = VALUES(level_xp),
       next_level_xp = VALUES(next_level_xp)`,
      [studentId, newTotalXP, levelData.level, levelData.levelXP, levelData.nextLevelXP]
    );

    // Check for new badges
    await checkAndAwardBadges(studentId, newTotalXP);

    return {
      totalXP: newTotalXP,
      level: levelData.level,
      levelXP: levelData.levelXP,
      nextLevelXP: levelData.nextLevelXP
    };
  } catch (error) {
    console.error('Error adding XP:', error);
    throw error;
  }
};

/**
 * Check and award badges based on total XP
 */
const checkAndAwardBadges = async (studentId, totalXP) => {
  try {
    // Get all badges student doesn't have yet
    const badges = await query(
      `SELECT b.* FROM badges b
       WHERE b.xp_required <= ?
       AND b.id NOT IN (
         SELECT badge_id FROM student_badges WHERE student_id = ?
       )`,
      [totalXP, studentId]
    );

    // Award new badges
    for (const badge of badges) {
      await query(
        'INSERT INTO student_badges (student_id, badge_id) VALUES (?, ?)',
        [studentId, badge.id]
      );
    }

    return badges;
  } catch (error) {
    console.error('Error checking badges:', error);
    throw error;
  }
};

/**
 * Get student XP summary
 */
const getStudentXP = async (studentId) => {
  try {
    const [xpData] = await query(
      'SELECT * FROM student_xp WHERE student_id = ?',
      [studentId]
    );

    if (!xpData) {
      // Initialize if doesn't exist
      await query(
        `INSERT INTO student_xp (student_id, total_xp, current_level, level_xp, next_level_xp)
         VALUES (?, 0, 1, 0, 100)`,
        [studentId]
      );
      return {
        student_id: studentId,
        total_xp: 0,
        current_level: 1,
        level_xp: 0,
        next_level_xp: 100
      };
    }

    return xpData;
  } catch (error) {
    console.error('Error getting student XP:', error);
    throw error;
  }
};

/**
 * Get student badges
 */
const getStudentBadges = async (studentId) => {
  try {
    const badges = await query(
      `SELECT b.*, sb.earned_at 
       FROM student_badges sb
       JOIN badges b ON sb.badge_id = b.id
       WHERE sb.student_id = ?
       ORDER BY sb.earned_at DESC`,
      [studentId]
    );
    return badges;
  } catch (error) {
    console.error('Error getting student badges:', error);
    throw error;
  }
};

/**
 * Get leaderboard
 */
const getLeaderboard = async (limit = 10) => {
  try {
    const leaderboard = await query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        sx.total_xp,
        sx.current_level,
        (SELECT COUNT(*) FROM achievements a WHERE a.student_id = u.id AND a.status = 'approved') as achievement_count
       FROM student_xp sx
       JOIN users u ON sx.student_id = u.id
       WHERE u.role = 'student'
       ORDER BY sx.total_xp DESC
       LIMIT ?`,
      [limit]
    );
    return leaderboard;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};

module.exports = {
  addXP,
  getStudentXP,
  getStudentBadges,
  getLeaderboard,
  calculateLevelFromXP,
  calculateXPForLevel
};
