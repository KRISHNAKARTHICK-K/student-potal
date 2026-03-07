import React, { useState } from "react";

export default function Header({ user }) {
  const [notifications, setNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="glass-header sticky top-0 z-40 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search modules, courses, students..."
              className="w-full px-4 py-2.5 pl-11 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all duration-200 hover:border-blue-500/50 group"
            >
              <span className="text-xl">🔔</span>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs flex items-center justify-center font-semibold shadow-lg">
                  {notifications}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 glass-card p-4 shadow-2xl border border-slate-700/50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-200">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <div className="text-sm font-medium text-slate-200">
                        New grade posted
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Math Assignment 3 - Grade: A-
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-200">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-slate-200">
                {user?.name || "User"}
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400">
                {user?.role || "guest"}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-sm font-semibold text-white shadow-lg shadow-blue-500/30 border-2 border-slate-700/50">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
