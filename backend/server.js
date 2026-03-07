require("dotenv").config();
const express = require("express");
const cors = require("cors");
const achievementRoutes = require("./routes/achievement.routes");
// DB connection (important)
require("./config/db");

// Routes
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const studentRoutes = require("./routes/student.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const teacherRoutes = require("./routes/teacher.routes");
const resumeRoutes = require("./routes/resume.routes");

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// #region agent log
const fs = require('fs');
const logPath = 'c:\\Users\\Krishna Karthick\\OneDrive\\Desktop\\project\\.cursor\\debug.log';
// #endregion

// Middleware to log all incoming requests (BEFORE routes)
app.use((req, res, next) => {
  // #region agent log
  try {
    const logEntry = JSON.stringify({location:'server.js:25',message:'Incoming request',data:{method:req.method,path:req.path,url:req.url,originalUrl:req.originalUrl,baseUrl:req.baseUrl},timestamp:Date.now(),runId:'run1',hypothesisId:'D'}) + '\n';
    fs.appendFileSync(logPath, logEntry);
  } catch(e) {}
  // #endregion
  next();
});

// Routes
// #region agent log
try {
  const logEntry = JSON.stringify({location:'server.js:35',message:'Registering achievement routes',data:{path:'/api/achievements'},timestamp:Date.now(),runId:'run1',hypothesisId:'B'}) + '\n';
  fs.appendFileSync(logPath, logEntry);
} catch(e) {}
// #endregion
app.use("/api/achievements", achievementRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/resume", resumeRoutes);

// Middleware to log unmatched requests (AFTER routes)
app.use((req, res, next) => {
  // #region agent log
  try {
    const logEntry = JSON.stringify({location:'server.js:48',message:'Unmatched request (404)',data:{method:req.method,path:req.path,url:req.url,originalUrl:req.originalUrl},timestamp:Date.now(),runId:'run1',hypothesisId:'D'}) + '\n';
    fs.appendFileSync(logPath, logEntry);
  } catch(e) {}
  // #endregion
  next();
});

// Test route
app.get("/", (req, res) => {
  // #region agent log
  try {
    const logEntry = JSON.stringify({location:'server.js:64',message:'Root route hit',data:{},timestamp:Date.now(),runId:'run1',hypothesisId:'A'}) + '\n';
    fs.appendFileSync(logPath, logEntry);
  } catch(e) {}
  // #endregion
  res.json({ message: "Backend running" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  // #region agent log
  try {
    const logEntry = JSON.stringify({location:'server.js:73',message:'Health check hit',data:{},timestamp:Date.now(),runId:'run1',hypothesisId:'A'}) + '\n';
    fs.appendFileSync(logPath, logEntry);
  } catch(e) {}
  // #endregion
  res.json({ status: "ok", message: "Backend is running", timestamp: new Date().toISOString() });
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  // #region agent log
  try {
    const logEntry = JSON.stringify({location:'server.js:89',message:'Server started',data:{port:PORT,achievementsRoute:'/api/achievements',categoriesRoute:'/api/achievements/categories'},timestamp:Date.now(),runId:'run1',hypothesisId:'A'}) + '\n';
    fs.appendFileSync(logPath, logEntry);
  } catch(e) {}
  // #endregion
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Categories endpoint: http://localhost:${PORT}/api/achievements/categories`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/api/achievements/test`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Log file: ${logPath}`);
});
