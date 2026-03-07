# Achievement System Installation Guide

## Prerequisites

- Node.js installed
- MySQL database running
- Backend and frontend dependencies installed

## Step 1: Install Frontend Chart Library

```bash
cd frontend
npm install recharts
```

## Step 2: Database Setup

### Run the schema:

```bash
mysql -u your_username -p your_database_name < backend/schema_achievements.sql
```

This creates:
- `achievement_categories` (with default categories)
- `achievements`
- `xp_log`
- `student_xp`
- `badges` (with default badges)
- `student_badges`

### (Optional) Add seed data:

```bash
mysql -u your_username -p your_database_name < backend/seed_achievements.sql
```

**Note**: Update student_id values in seed file to match your actual user IDs.

## Step 3: Verify Backend Routes

The achievement routes are already registered in `server.js`:
```javascript
app.use("/api/achievements", achievementRoutes);
```

## Step 4: Test the System

1. **Start Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test as Student**:
   - Login as a student
   - Navigate to "Submit Achievement"
   - Fill form and submit
   - Check "Achievements" page
   - View "XP Dashboard" for analytics

4. **Test as Admin**:
   - Login as admin
   - Navigate to "Verify Achievements"
   - Approve/reject pending achievements
   - Assign XP points

## API Testing

### Get Categories (Public):
```bash
curl http://localhost:5000/api/achievements/categories
```

### Submit Achievement (Student):
```bash
curl -X POST http://localhost:5000/api/achievements \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Won Hackathon",
    "description": "First place in coding competition",
    "category_id": 4,
    "certificate_url": "https://example.com/cert.pdf"
  }'
```

### Get Pending (Admin):
```bash
curl http://localhost:5000/api/achievements/pending \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Verify Achievement (Admin):
```bash
curl -X PUT http://localhost:5000/api/achievements/verify/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve",
    "xp": 150
  }'
```

## Troubleshooting

### Charts not rendering?
- Ensure `recharts` is installed: `npm install recharts`
- Check browser console for errors

### Database errors?
- Verify all tables were created
- Check foreign key constraints
- Ensure users table exists first

### XP not updating?
- Check XP service is being called
- Verify achievement status is 'approved'
- Check xp_log table for entries

### Badges not awarding?
- Verify badge XP thresholds
- Check student_xp.total_xp value
- Review badge awarding logic in xp.service.js

## File Structure

```
backend/
├── schema_achievements.sql      # Database schema
├── seed_achievements.sql        # Sample data
├── services/
│   └── xp.service.js           # XP calculation logic
├── controllers/
│   └── achievement.controller.js
└── routes/
    └── achievement.routes.js

frontend/src/pages/
├── AchievementsPage.jsx        # Certificate gallery
├── AchievementUploadPage.jsx   # Submission form
├── XPDashboardPage.jsx         # Analytics dashboard
└── AdminAchievementsPage.jsx   # Verification panel
```

## Next Steps

1. **File Upload**: Integrate cloud storage (AWS S3, Cloudinary)
2. **Email Notifications**: Notify students on approval/rejection
3. **Advanced Analytics**: Add more chart types
4. **Mobile Optimization**: Responsive design improvements
5. **Achievement Templates**: Pre-defined achievement types
