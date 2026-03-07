-- Seed data for Achievement System Testing
-- Run this after schema_achievements.sql

-- Sample achievements for testing (assuming user IDs exist)
-- Replace student_id values with actual user IDs from your users table

-- Example: Add some approved achievements for a student (replace 1 with actual student_id)
INSERT INTO achievements (student_id, title, description, category_id, certificate_url, status, xp, verified_by, verified_at, created_at)
SELECT 
  1 as student_id,
  'Won First Place in Hackathon' as title,
  'Developed a full-stack application in 24 hours and won the competition' as description,
  (SELECT id FROM achievement_categories WHERE name = 'Hackathon') as category_id,
  'https://example.com/certificates/hackathon-2024.pdf' as certificate_url,
  'approved' as status,
  150 as xp,
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1) as verified_by,
  NOW() as verified_at,
  DATE_SUB(NOW(), INTERVAL 30 DAY) as created_at
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1);

INSERT INTO achievements (student_id, title, description, category_id, certificate_url, status, xp, verified_by, verified_at, created_at)
SELECT 
  1 as student_id,
  'Published Research Paper' as title,
  'Co-authored a research paper on machine learning applications' as description,
  (SELECT id FROM achievement_categories WHERE name = 'Research') as category_id,
  'https://example.com/certificates/research-paper.pdf' as certificate_url,
  'approved' as status,
  200 as xp,
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1) as verified_by,
  NOW() as verified_at,
  DATE_SUB(NOW(), INTERVAL 20 DAY) as created_at
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1);

INSERT INTO achievements (student_id, title, description, category_id, certificate_url, status, xp, verified_by, verified_at, created_at)
SELECT 
  1 as student_id,
  'Open Source Contributor' as title,
  'Contributed to major open source projects on GitHub' as description,
  (SELECT id FROM achievement_categories WHERE name = 'Coding') as category_id,
  'https://example.com/certificates/opensource.pdf' as certificate_url,
  'approved' as status,
  100 as xp,
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1) as verified_by,
  NOW() as verified_at,
  DATE_SUB(NOW(), INTERVAL 15 DAY) as created_at
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1);

-- Add a pending achievement
INSERT INTO achievements (student_id, title, description, category_id, certificate_url, status, created_at)
SELECT 
  1 as student_id,
  'Sports Championship Winner' as title,
  'Won the inter-college basketball championship' as description,
  (SELECT id FROM achievement_categories WHERE name = 'Sports') as category_id,
  'https://example.com/certificates/basketball.pdf' as certificate_url,
  'pending' as status,
  NOW() as created_at
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1);

-- Initialize student XP (replace 1 with actual student_id)
INSERT INTO student_xp (student_id, total_xp, current_level, level_xp, next_level_xp)
SELECT 
  1 as student_id,
  450 as total_xp,
  3 as current_level,
  50 as level_xp,
  150 as next_level_xp
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
ON DUPLICATE KEY UPDATE total_xp = 450, current_level = 3, level_xp = 50, next_level_xp = 150;

-- Add XP log entries
INSERT INTO xp_log (student_id, achievement_id, xp_amount, source, description, created_at)
SELECT 
  1 as student_id,
  (SELECT id FROM achievements WHERE student_id = 1 AND title = 'Won First Place in Hackathon' LIMIT 1) as achievement_id,
  150 as xp_amount,
  'achievement' as source,
  'Approved achievement: Won First Place in Hackathon' as description,
  DATE_SUB(NOW(), INTERVAL 30 DAY) as created_at
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1);

INSERT INTO xp_log (student_id, achievement_id, xp_amount, source, description, created_at)
SELECT 
  1 as student_id,
  (SELECT id FROM achievements WHERE student_id = 1 AND title = 'Published Research Paper' LIMIT 1) as achievement_id,
  200 as xp_amount,
  'achievement' as source,
  'Approved achievement: Published Research Paper' as description,
  DATE_SUB(NOW(), INTERVAL 20 DAY) as created_at
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1);

INSERT INTO xp_log (student_id, achievement_id, xp_amount, source, description, created_at)
SELECT 
  1 as student_id,
  (SELECT id FROM achievements WHERE student_id = 1 AND title = 'Open Source Contributor' LIMIT 1) as achievement_id,
  100 as xp_amount,
  'achievement' as source,
  'Approved achievement: Open Source Contributor' as description,
  DATE_SUB(NOW(), INTERVAL 15 DAY) as created_at
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1);
