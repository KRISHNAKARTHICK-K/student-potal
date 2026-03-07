/**
 * Seed Categories Script
 * Run this to ensure categories are populated in the database
 * Usage: node scripts/seed_categories.js
 */

require('dotenv').config();
const db = require('../config/db');

const categories = [
  { name: 'Sports', icon: '⚽', color: '#10b981' },
  { name: 'Coding', icon: '💻', color: '#3b82f6' },
  { name: 'Research', icon: '🔬', color: '#8b5cf6' },
  { name: 'Hackathon', icon: '🏆', color: '#f59e0b' },
  { name: 'Leadership', icon: '👑', color: '#ec4899' },
  { name: 'Academics', icon: '📚', color: '#06b6d4' },
  { name: 'Arts', icon: '🎨', color: '#f97316' },
  { name: 'Community Service', icon: '🤝', color: '#14b8a6' },
  { name: 'Innovation', icon: '💡', color: '#6366f1' },
  { name: 'Competition', icon: '🎯', color: '#ef4444' }
];

const seedCategories = () => {
  return new Promise((resolve, reject) => {
    let inserted = 0;
    let skipped = 0;

    categories.forEach((cat, index) => {
      db.query(
        'INSERT IGNORE INTO achievement_categories (name, icon, color) VALUES (?, ?, ?)',
        [cat.name, cat.icon, cat.color],
        (error, results) => {
          if (error) {
            console.error(`Error inserting ${cat.name}:`, error);
          } else {
            if (results.affectedRows > 0) {
              inserted++;
              console.log(`✅ Inserted: ${cat.name}`);
            } else {
              skipped++;
              console.log(`⏭️  Skipped (exists): ${cat.name}`);
            }
          }

          // Last item
          if (index === categories.length - 1) {
            console.log(`\n📊 Summary: ${inserted} inserted, ${skipped} skipped`);
            resolve({ inserted, skipped });
          }
        }
      );
    });
  });
};

// Run if called directly
if (require.main === module) {
  console.log('🌱 Seeding achievement categories...\n');
  seedCategories()
    .then(() => {
      console.log('\n✅ Categories seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error seeding categories:', error);
      process.exit(1);
    });
}

module.exports = seedCategories;
