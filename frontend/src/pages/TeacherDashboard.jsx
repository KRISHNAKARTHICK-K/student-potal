import React, { useState, useEffect } from "react";

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    classesToday: 0,
    attendancePending: 0,
    totalClasses: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/teacher/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (data) setStats(data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };

    const fetchActivity = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/teacher/activity", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (data?.activity) setRecentActivity(data.activity);
      } catch (err) {
        console.error("Activity fetch failed:", err);
      }
    };

    Promise.all([fetchDashboard(), fetchActivity()]).finally(() =>
      setLoading(false)
    );
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-xl">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h1
          className="text-3xl font-bold mb-2 gradient-text"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Teacher Dashboard
        </h1>
        <p className="text-slate-400">
          Manage your classes and track student progress
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card-hover p-6 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">
              👥
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {stats.totalStudents}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">
                Students
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-400">Total Enrolled</div>
        </div>

        <div className="glass-card-hover p-6 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-2xl shadow-lg shadow-green-500/30">
              📅
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {stats.classesToday}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">
                Classes
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-400">Today</div>
        </div>

        <div className="glass-card-hover p-6 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-yellow-500/30">
              ⏰
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {stats.attendancePending}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">
                Pending
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-400">Attendance</div>
        </div>

        <div className="glass-card-hover p-6 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30">
              📚
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {stats.totalClasses}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">
                Total
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-400">Classes This Week</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h2
          className="text-xl font-bold text-white mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Recent Activity
        </h2>

        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <div className="text-slate-400 text-sm">
              No recent activity yet.
            </div>
          ) : (
            recentActivity.map((activity, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📌</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-200 mb-1">
                      {activity.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      {activity.time}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
