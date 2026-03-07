-- Achievement & Certificate System Schema
-- Gamification with XP, Levels, and Badges

-- Achievement Categories
CREATE TABLE IF NOT EXISTS achievement_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50) DEFAULT '🏆',
  color VARCHAR(20) DEFAULT '#3b82f6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT NOT NULL,
  certificate_url VARCHAR(500),
  certificate_file_path VARCHAR(500),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  xp INT DEFAULT 0,
  verified_by INT NULL,
  verified_at TIMESTAMP NULL,
  rejection_reason TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_achievement_student
    FOREIGN KEY (student_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_achievement_category
    FOREIGN KEY (category_id) REFERENCES achievement_categories(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_achievement_verifier
    FOREIGN KEY (verified_by) REFERENCES users(id)
    ON DELETE SET NULL,
  INDEX idx_student_id (student_id),
  INDEX idx_status (status),
  INDEX idx_category_id (category_id)
);

-- XP Log (Track all XP transactions)
CREATE TABLE IF NOT EXISTS xp_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  achievement_id INT NULL,
  xp_amount INT NOT NULL,
  source VARCHAR(50) NOT NULL, -- 'achievement', 'bonus', 'penalty'
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_xp_student
    FOREIGN KEY (student_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_xp_achievement
    FOREIGN KEY (achievement_id) REFERENCES achievements(id)
    ON DELETE SET NULL,
  INDEX idx_student_id (student_id),
  INDEX idx_created_at (created_at)
);

-- Student XP Summary (Denormalized for performance)
CREATE TABLE IF NOT EXISTS student_xp (
  student_id INT PRIMARY KEY,
  total_xp INT DEFAULT 0,
  current_level INT DEFAULT 1,
  level_xp INT DEFAULT 0, -- XP in current level
  next_level_xp INT DEFAULT 100, -- XP needed for next level
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_student_xp_user
    FOREIGN KEY (student_id) REFERENCES users(id)
    ON DELETE CASCADE
);

-- Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT '🏅',
  xp_required INT NOT NULL,
  category_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_badge_category
    FOREIGN KEY (category_id) REFERENCES achievement_categories(id)
    ON DELETE SET NULL
);

-- Student Badges (Many-to-Many)
CREATE TABLE IF NOT EXISTS student_badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  badge_id INT NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_student_badge_student
    FOREIGN KEY (student_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_student_badge_badge
    FOREIGN KEY (badge_id) REFERENCES badges(id)
    ON DELETE CASCADE,
  UNIQUE KEY unique_student_badge (student_id, badge_id),
  INDEX idx_student_id (student_id)
);

-- Leaderboard View (Virtual - calculated on demand)
-- Or use a materialized table that updates periodically

-- Insert Default Categories (if they don't exist)
INSERT IGNORE INTO achievement_categories (name, icon, color) VALUES
('Sports', '⚽', '#10b981'),
('Coding', '💻', '#3b82f6'),
('Research', '🔬', '#8b5cf6'),
('Hackathon', '🏆', '#f59e0b'),
('Leadership', '👑', '#ec4899'),
('Academics', '📚', '#06b6d4'),
('Arts', '🎨', '#f97316'),
('Community Service', '🤝', '#14b8a6'),
('Innovation', '💡', '#6366f1'),
('Competition', '🎯', '#ef4444');

-- Insert Default Badges
INSERT INTO badges (name, description, icon, xp_required, category_id) VALUES
('First Steps', 'Earn your first 100 XP', '🌱', 100, NULL),
('Rising Star', 'Reach 500 XP', '⭐', 500, NULL),
('Champion', 'Reach 1000 XP', '🏆', 1000, NULL),
('Elite', 'Reach 2500 XP', '👑', 2500, NULL),
('Legend', 'Reach 5000 XP', '🌟', 5000, NULL),
('Coding Master', 'Earn 500 XP in Coding', '💻', 500, (SELECT id FROM achievement_categories WHERE name = 'Coding')),
('Sports Hero', 'Earn 500 XP in Sports', '⚽', 500, (SELECT id FROM achievement_categories WHERE name = 'Sports')),
('Research Scholar', 'Earn 500 XP in Research', '🔬', 500, (SELECT id FROM achievement_categories WHERE name = 'Research'))
ON DUPLICATE KEY UPDATE name=name;
