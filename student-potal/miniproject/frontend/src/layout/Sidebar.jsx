import React from "react";

const groupLabelClass =
  "mt-2 mb-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-400";

const itemButtonClass = (active) =>
  `w-full text-left text-[13px] rounded-lg px-3 py-2 transition-colors duration-150
   ${active ? "bg-slate-800/80 text-slate-50" : "text-slate-200/85 hover:bg-slate-800/60 hover:text-white"}`;

export default function Sidebar({ role, currentPage, onNavigate, onLogout }) {
  const studentItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "attendance", label: "Attendance" },
    { id: "courses", label: "Courses" },
    { id: "grades", label: "Grades" }
  ];

  const teacherItems = [
    { id: "teacher-dashboard", label: "Dashboard" },
    { id: "teacher-attendance", label: "Mark Attendance" },
    { id: "teacher-summary", label: "Attendance Summary" }
  ];

  const adminItems = [
    { id: "admin-dashboard", label: "Admin Dashboard" },
    { id: "admin-students", label: "Students" }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>ACADEMIA</span>
      </div>

      <nav className="sidebar-menu">
        {role === "student" && (
          <div>
            <p className={groupLabelClass}>Student</p>
            {studentItems.map((item) => (
              <button
                key={item.id}
                className={itemButtonClass(currentPage === item.id)}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {role === "teacher" && (
          <div>
            <p className={groupLabelClass}>Teacher</p>
            {teacherItems.map((item) => (
              <button
                key={item.id}
                className={itemButtonClass(currentPage === item.id)}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {role === "admin" && (
          <div>
            <p className={groupLabelClass}>Admin</p>
            {adminItems.map((item) => (
              <button
                key={item.id}
                className={itemButtonClass(currentPage === item.id)}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4">
          <p className={groupLabelClass}>Account</p>
          <button
            className={itemButtonClass(currentPage === "settings")}
            onClick={() => onNavigate("settings")}
          >
            Settings
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <span>Signed in as {role}</span>
        <button className="logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
