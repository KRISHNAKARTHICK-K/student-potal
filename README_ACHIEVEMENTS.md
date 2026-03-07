# Achievement & Certificate System

A full-stack gamification system for the Student Portal with XP, levels, badges, and analytics.

## 🚀 Quick Start

### 1. Database Setup

Run the SQL schemas in order:

```bash
# 1. Create achievement tables
mysql -u your_user -p your_database < backend/schema_achievements.sql

# 2. (Optional) Add seed data for testing
mysql -u your_user -p your_database < backend/seed_achievements.sql
```

### 2. Install Frontend Dependencies

The system uses **recharts** for charts. Install it:

```bash
cd frontend
npm install recharts
```

### 3. Backend Setup

The backend is already configured. Ensure your `.env` file has:

```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_database
JWT_SECRET=your_jwt_secret
```

### 4. Start the Application

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run dev
```

## 📋 Features

### Student Features

- ✅ Submit achievements with certificates
- ✅ View XP dashboard with analytics
- ✅ Track level progression
- ✅ Earn badges automatically
- ✅ View certificate gallery
- ✅ See skill strengths (radar chart)
- ✅ View XP distribution (pie chart)
- ✅ Track achievements over time (bar chart)

### Admin Features

- ✅ Review pending achievements
- ✅ Approve/reject achievements
- ✅ Assign XP points
- ✅ View student achievement history

## 🗄️ Database Schema

### Tables

1. **achievement_categories** - Predefined categories (Sports, Coding, Research, etc.)
2. **achievements** - Student achievements with status (pending/approved/rejected)
3. **xp_log** - All XP transactions for audit trail
4. **student_xp** - Denormalized XP summary for performance
5. **badges** - Badge definitions
6. **student_badges** - Many-to-many relationship for earned badges

## 📊 API Endpoints

### Public
- `GET /api/achievements/categories` - Get all categories
- `GET /api/achievements/leaderboard` - Get leaderboard

### Student (Authenticated)
- `POST /api/achievements` - Submit new achievement
- `GET /api/achievements/mine` - Get own achievements
- `GET /api/achievements/analytics` - Get analytics data

### Admin (Authenticated)
- `GET /api/achievements/pending` - Get pending achievements
- `PUT /api/achievements/verify/:id` - Approve/reject achievement

## 🎮 XP & Level System

### Level Formula
- XP required for level N = `100 * N^1.5`
- Levels: 1-10 (configurable)
- Automatic badge awarding based on total XP

### XP Sources
- Approved achievements (admin-assigned)
- Future: Bonus XP, penalties, etc.

## 📈 Analytics Charts

1. **Pie Chart**: XP distribution by category
2. **Bar Chart**: Achievements per month
3. **Radar Chart**: Skill strengths across categories

## 🎨 UI Components

- `AchievementsPage.jsx` - Certificate gallery
- `AchievementUploadPage.jsx` - Submission form
- `XPDashboardPage.jsx` - Analytics dashboard
- `AdminAchievementsPage.jsx` - Verification panel

## 🔐 Security

- JWT authentication required
- Role-based access control (student/admin)
- Students can only see their own achievements
- Only admins can verify achievements

## 📝 Notes

- File uploads: Currently uses URLs. For production, integrate with cloud storage (AWS S3, Cloudinary, etc.)
- Certificate preview: Supports images and PDFs
- Badge system: Auto-awards badges when XP thresholds are met
- Leaderboard: Top 10 students by default

## 🐛 Troubleshooting

1. **Charts not showing**: Ensure `recharts` is installed
2. **Database errors**: Check table creation order
3. **XP not updating**: Verify XP service is called after approval
4. **Badges not awarding**: Check XP thresholds in badges table

## 🔄 Future Enhancements

- [ ] File upload to cloud storage
- [ ] Email notifications for approvals
- [ ] Achievement sharing
- [ ] Team achievements
- [ ] Achievement templates
- [ ] Advanced analytics
- [ ] Mobile app support
