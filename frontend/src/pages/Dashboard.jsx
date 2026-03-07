import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    currentGPA: 0,
    totalCourses: 0,
    attendanceRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user) {
      setLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/student/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch dashboard");

        const data = await res.json();

        setStats({
          currentGPA: data.cgpa || 0,
          totalCourses: data.courses || 0,
          attendanceRate: data.attendance || 0,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-400">
          Here’s your real-time academic overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card icon="📊" value={stats.currentGPA} label="CGPA" />
        <Card icon="📚" value={stats.totalCourses} label="Courses" />
        <Card icon="✅" value={`${stats.attendanceRate}%`} label="Attendance" />
      </div>
    </div>
  );
}

function Card({ icon, value, label }) {
  return (
    <div className="glass-card-hover p-6">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}