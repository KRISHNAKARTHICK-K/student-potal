import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./pages/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./App.css";

/* AUTH */
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

/* STUDENT */
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import CoursesPage from "./pages/CoursesPage";
import AttendancePage from "./pages/AttendancePage";
import GradesPage from "./pages/GradesPage";
import AchievementsPage from "./pages/AchievementsPage";
import AchievementUploadPage from "./pages/AchievementUploadPage";
import XPDashboardPage from "./pages/XPDashboardPage";
import ResumeBuilder from "./pages/ResumeBuilder";
import ATSAnalyzer from "./pages/ATSAnalyzer";

/* TEACHER */
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherAttendanceSummary from "./pages/TeacherAttendanceSummary";
import TeacherAttendancePage from "./pages/TeacherAttendancePage";
import TeacherMarkAttendance from "./pages/TeacherMarkAttendance";

/* ADMIN */
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminAchievementsPage from "./pages/AdminAchievementsPage";

/* LAYOUT */
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";

const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen text-lg font-semibold">
    Loading...
  </div>
);

const AppRouter = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("login");
  const [loading, setLoading] = useState(false);

  /* ROLE REDIRECT */
  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") setCurrentPage("admin-dashboard");
    else if (user.role === "teacher") setCurrentPage("teacher-dashboard");
    else if (user.role === "student") setCurrentPage("dashboard");
  }, [user]);

  const handleNavigate = (page) => {
    if (page === currentPage) return;
    setLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setLoading(false);
    }, 120);
  };

  const handleLogout = () => {
    logout();
    setCurrentPage("login");
  };

  if (loading) return <LoadingScreen />;

  /* ================= AUTH SCREENS ================= */
  if (!user) {
    switch (currentPage) {
      case "forgot-password":
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      default:
        return <LoginPage onNavigate={handleNavigate} />;
    }
  }

  /* ================= MAIN LAYOUT ================= */
  return (
    <div className="app-layout">
      <Sidebar
        role={user.role}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <div className="app-main">
        <Header user={user} />

        <main className="app-content">
          {(() => {
            switch (currentPage) {

              /* ================= STUDENT ================= */
              case "dashboard":
                return user.role === "student" ? <Dashboard /> : null;
              case "attendance":
                return user.role === "student" ? <AttendancePage /> : null;
              case "courses":
                return user.role === "student" ? <CoursesPage /> : null;
              case "grades":
                return user.role === "student" ? <GradesPage /> : null;
              case "achievements":
                return user.role === "student" ? <AchievementsPage /> : null;
              case "achievement-upload":
                return user.role === "student" ? <AchievementUploadPage /> : null;
              case "xp-dashboard":
                return user.role === "student" ? <XPDashboardPage /> : null;
              case "resume-builder":
                return user.role === "student" ? <ResumeBuilder onNavigate={handleNavigate} /> : null;
              case "ats-analyzer":
                return user.role === "student" ? <ATSAnalyzer /> : null;

              /* ================= TEACHER ================= */
              case "teacher-dashboard":
                return user.role === "teacher" ? <TeacherDashboard /> : null;
              case "teacher-attendance":
                return user.role === "teacher" ? <TeacherAttendancePage /> : null;
              case "teacher-summary":
                return user.role === "teacher" ? <TeacherAttendanceSummary /> : null;
              case "teacher-mark":
                return user.role === "teacher" ? <TeacherMarkAttendance /> : null;

              /* ================= ADMIN ================= */
              case "admin-dashboard":
                return user.role === "admin" ? <AdminDashboard /> : null;
              case "admin-students":
                return user.role === "admin" ? <AdminStudents /> : null;
              case "admin-achievements":
                return user.role === "admin" ? <AdminAchievementsPage /> : null;

              /* ================= COMMON ================= */
              case "profile":
                return <ProfilePage />;
              case "settings":
                return <SettingsPage />;

              /* ================= SAFE FALLBACK ================= */
              default:
                if (user.role === "teacher") return <TeacherDashboard />;
                if (user.role === "admin") return <AdminDashboard />;
                return <Dashboard />;
            }
          })()}
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </ThemeProvider>
);

export default App;