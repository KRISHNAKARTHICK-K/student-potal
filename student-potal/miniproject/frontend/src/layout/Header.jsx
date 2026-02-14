import React from "react";

export default function Header({ user }) {
  return (
    <header className="header">
      <input
        type="text"
        placeholder="Search modules, courses, students..."
        className="search"
      />

      <div className="header-right flex items-center gap-3">
        <div className="text-right">
          <div className="text-[13px] font-medium text-slate-800">
            {user?.name || "User"}
          </div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            {user?.role || "guest"}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-semibold text-white shadow-md">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
    </header>
  );
}
