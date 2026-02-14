import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./pages/AuthContext";
import "./App.css";

/* AUTH */
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

/* STUDENT */
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import CoursesPage from "./pages/CoursesPage";
import AttendancePage from "./pages/AttendancePage";
import GradesPage from "./pages/GradesPage";

/* TEACHER */
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherAttendanceSummary from "./pages/TeacherAttendanceSummary";
import TeacherAttendancePage from "./pages/TeacherAttendancePage";
import TeacherMarkAttendance from "./pages/TeacherMarkAtttendance";
/* ADMIN */
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";

/* LAYOUT */
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";

/* LOADING */
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen text-lg font-semibold">
    Loading...
  </div>
);

/* =========================
   ROUTER
========================= */
const AppRouter = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("signup");
  const [loading, setLoading] = useState(false);

  /* ROLE REDIRECT */
  useEffect(() => {
    if (!user) return;

    if (["login", "signup", "forgot-password"].includes(currentPage)) {
      if (user.role === "admin") setCurrentPage("admin-dashboard");
      else if (user.role === "teacher") setCurrentPage("teacher-dashboard");
      else setCurrentPage("dashboard");
    }
  }, [user, currentPage]);

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
    setCurrentPage("signup");
  };

  if (loading) return <LoadingScreen />;

  /* AUTH SCREENS */
  if (!user) {
    switch (currentPage) {
      case "login":
        return <LoginPage onNavigate={handleNavigate} />;
      case "forgot-password":
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      default:
        return <SignupPage onNavigate={handleNavigate} />;
    }
  }

  /* =========================
     MAIN LAYOUT
  ========================= */
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
              /* STUDENT */
              case "dashboard":
                return <Dashboard />;
              case "attendance":
                return <AttendancePage />;
              case "courses":
                return <CoursesPage />;
              case "grades":
                return <GradesPage />;

              /* TEACHER */
              case "teacher-dashboard":
                return <TeacherDashboard />;
              case "teacher-attendance":
                return <TeacherAttendancePage />;
              case "teacher-summary":
                return <TeacherAttendanceSummary />;
              case "teacher-mark":
                return <TeacherMarkAttendance />;

              /* ADMIN */
              case "admin-dashboard":
                return <AdminDashboard />;
              case "admin-students":
                return <AdminStudents />;

              /* COMMON */
              case "profile":
                return <ProfilePage />;
              case "settings":
                return <SettingsPage />;

              default:
                return <Dashboard />;
            }
          })()}
        </main>
      </div>
    </div>
  );
};

/* =========================
   MAIN APP
========================= */
const App = () => (
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);

export default App;
