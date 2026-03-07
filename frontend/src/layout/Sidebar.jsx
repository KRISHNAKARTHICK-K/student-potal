import React, { useState } from "react";

const groupLabelClass =
  "mt-4 mb-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-400/60 px-3";

const itemButtonClass = (active, collapsed) =>
  `w-full text-left text-sm rounded-lg px-3 py-2.5 transition-all duration-200 flex items-center gap-3
   ${active 
     ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-l-2 border-blue-500 shadow-lg shadow-blue-500/20" 
     : "text-slate-300/80 hover:bg-slate-800/60 hover:text-white hover:translate-x-1"
   }
   ${collapsed ? "justify-center px-2" : ""}`;

export default function Sidebar({ role, currentPage, onNavigate, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  const studentItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "attendance", label: "Attendance", icon: "📅" },
    { id: "courses", label: "Courses", icon: "📚" },
    { id: "grades", label: "Grades", icon: "🎓" },
    { id: "xp-dashboard", label: "XP Dashboard", icon: "⭐" },
    { id: "achievements", label: "Achievements", icon: "🏆" },
    { id: "achievement-upload", label: "Submit Achievement", icon: "➕" },
    { id: "resume-builder", label: "Resume Builder", icon: "📄" },
    { id: "ats-analyzer", label: "ATS Analyzer", icon: "📈" }
  ];

  const teacherItems = [
    { id: "teacher-dashboard", label: "Dashboard", icon: "📊" },
    { id: "teacher-attendance", label: "Mark Attendance", icon: "✅" },
    { id: "teacher-summary", label: "Attendance Summary", icon: "📈" }
  ];

  const adminItems = [
    { id: "admin-dashboard", label: "Admin Dashboard", icon: "🏠" },
    { id: "admin-students", label: "Students", icon: "👥" },
    { id: "admin-achievements", label: "Verify Achievements", icon: "✅" }
  ];

  const renderItems = (items, label) => (
    <>
      {!collapsed && <p className={groupLabelClass}>{label}</p>}
      {items.map((item) => (
        <button
          key={item.id}
          className={itemButtonClass(currentPage === item.id, collapsed)}
          onClick={() => onNavigate(item.id)}
          title={collapsed ? item.label : ""}
        >
          <span className="text-lg">{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
        </button>
      ))}
    </>
  );

  return (
    <aside
      className={`fixed left-0 top-0 h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 z-50 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
      style={{
        background:
          "linear-gradient(180deg, hsl(222 47% 7%) 0%, hsl(222 47% 9%) 100%)",
        boxShadow: "4px 0 24px rgba(0, 0, 0, 0.3)"
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50 flex-shrink-0">
        {!collapsed && (
          <h1 className="text-xl font-bold gradient-text">
            ACADEMIA
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {role === "student" && renderItems(studentItems, "Student")}
        {role === "teacher" && renderItems(teacherItems, "Teacher")}
        {role === "admin" && renderItems(adminItems, "Admin")}
      </div>

      {/* Fixed Account Section */}
      <div className="border-t border-slate-700/50 p-4 flex-shrink-0">
        {!collapsed && <p className={groupLabelClass}>Account</p>}

        <button
          className={itemButtonClass(currentPage === "settings", collapsed)}
          onClick={() => onNavigate("settings")}
        >
          <span className="text-lg">⚙️</span>
          {!collapsed && <span>Settings</span>}
        </button>

        <button
          onClick={onLogout}
          className="mt-3 w-full px-3 py-2 rounded-lg bg-gradient-to-r from-red-600/20 to-red-500/20 text-red-400 hover:from-red-600/30 hover:to-red-500/30 transition-all duration-200 flex items-center justify-center gap-2 border border-red-500/20 hover:border-red-500/40"
        >
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}