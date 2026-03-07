# 🎓 Student Portal System

A full-stack **Student Portal Application** designed to streamline academic management for students, teachers, and administrators.
The system provides modules for **attendance tracking, achievements management, resume ATS analysis, course management, and analytics dashboards**.

This project is built using a **modern web stack** with React.js for the frontend and Node.js + Express.js for the backend.

---

# 🚀 Features

## Core Features

* 👨‍🎓 **Student Dashboard**

  * View profile details
  * Track attendance
  * View achievements
  * Access academic data

* 👩‍🏫 **Teacher Module**

  * Mark student attendance
  * View attendance summary
  * Teacher analytics dashboard

* 🛠 **Admin Module**

  * Manage students
  * Manage courses
  * Monitor system usage

---

## Additional Modules

### 🏆 Achievement Management

Students can upload and track their achievements including:

* Academic certificates
* Sports achievements
* Technical competition wins
* Hackathon participation

Admins can verify and manage submitted achievements.

---

### 📊 Attendance Management

* Daily attendance marking
* Attendance summary reports
* Teacher attendance analytics
* PDF attendance reports

---

### 📄 Resume ATS Analyzer

Students can upload resumes and analyze them against **ATS (Applicant Tracking System) standards**.

Features include:

* Resume score analysis
* Keyword optimization
* Resume improvement suggestions

---

### 📈 Teacher Analytics

Provides insights for teachers including:

* Attendance trends
* Student participation
* Performance indicators

---

# 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* REST API Architecture

### Database

* MySQL

### Other Tools

* JWT Authentication
* PDF generation
* File uploads

---

# ⚙ Installation Instructions

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/student-portal.git
cd student-portal
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 4. Setup Environment Variables

Create a `.env` file inside the **backend** folder.

Example:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=student_portal
JWT_SECRET=your_secret_key
```

---

## 5. Setup Database

Import the SQL schema files located in:

```
backend/schema_*.sql
```

Example:

* achievements schema
* teacher attendance schema
* main system schema

---

# ▶ Running the Application

## Start Backend Server

```bash
cd backend
npm start
```

Server runs on:

```
http://localhost:5000
```

---

## Start Frontend

```bash
cd frontend
npm run dev
```

Application runs on:

```
http://localhost:5173
```

---

# 🧩 Project Structure

```
student-portal
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── migrations
│   ├── services
│   ├── scripts
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── contexts
│   │   ├── layout
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   │
│   └── package.json
│
├── documentation
│   ├── ACHIEVEMENT_SYSTEM_SUMMARY.md
│   ├── ATTENDANCE_DATE_FIX_SUMMARY.md
│   └── TEACHER_MODULE_COMPLETE.md
│
└── README.md
```

---

# 🔑 Key Components

## Authentication System

* JWT-based authentication
* Secure login for:

  * Students
  * Teachers
  * Administrators

---

## Attendance Module

Main files include:

```
attendance.controller.js
attendance.routes.js
TeacherAttendancePage.jsx
TeacherAttendanceSummary.jsx
```

---

## Achievement Module

```
achievement.controller.js
achievement.routes.js
AchievementsPage.jsx
AchievementUploadPage.jsx
AdminAchievementsPage.jsx
```

---

## Resume ATS Analyzer

```
resume.controller.js
resume.routes.js
ResumeBuilder.jsx
ATSAnalyzer.jsx
resumeService.js
```

---

# 🧑‍💻 Development Tips

### 1. Use Modular Code

Each module (attendance, achievements, resume ATS) is structured using:

* Controller
* Routes
* Frontend page

---

### 2. API Communication

All API calls are centralized in:

```
frontend/src/services/api.js
```

---

### 3. Environment Configuration

Sensitive credentials must always be stored in:

```
.env
```

Never commit `.env` files to GitHub.

---

### 4. Database Migrations

SQL schemas are stored inside:

```
backend/migrations
backend/schema_*.sql
```

These help maintain consistent database structure.

---

# 🚀 Deployment Instructions

## Backend Deployment

You can deploy backend on:

* Render
* Railway
* AWS
* DigitalOcean

Steps:

1. Push repository to GitHub
2. Connect repository to hosting service
3. Add environment variables
4. Deploy Node.js server

---

## Frontend Deployment

Deploy React frontend using:

* Vercel
* Netlify
* GitHub Pages

Example for Vercel:

```
npm run build
```

Upload the `dist` folder.

---

# 🤝 Contributing

Contributions are welcome.

Steps:

1. Fork the repository
2. Create a feature branch

```
git checkout -b feature/new-module
```

3. Commit changes
4. Submit a Pull Request

---

# 📞 Support

If you encounter issues:

* Open an issue on GitHub
* Contact the project maintainers

---

# 📜 License

This project is developed for **educational and academic purposes**.

---

# ⭐ Acknowledgment

Developed as part of a **Student Portal Academic Project** to demonstrate:

* Full-stack development
* REST API design
* Database integration
* Real-world academic system features
