import React, { useState, useEffect } from "react";
import api from "../services/api";

function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/attendance/pdf", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("PDF download failed");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);

        const res = await api.get("/attendance/my");

        // 🔥 normalize backend P/A/L to readable text
        const records = (res.data.attendance || []).map(r => ({
          ...r,
          status:
            r.status === "P"
              ? "present"
              : r.status === "A"
              ? "absent"
              : r.status === "L"
              ? "late"
              : r.status
        }));

        const totalClasses = records.length;
        const attendedClasses = records.filter(r => r.status === "present").length;
        const absentClasses = records.filter(r => r.status === "absent").length;
        const lateClasses = records.filter(r => r.status === "late").length;

        const attendancePercentage =
          totalClasses > 0
            ? ((attendedClasses / totalClasses) * 100).toFixed(1)
            : 0;

        const courseData = [
          {
            courseId: "GEN101",
            courseName: "General Attendance",
            totalClasses,
            attendedClasses,
            absentClasses,
            lateClasses,
            attendancePercentage,
            status: attendancePercentage >= 75 ? "good" : "warning",
            attendanceHistory: records
          }
        ];

        setAttendanceData(courseData);
      } catch (err) {
        console.error(err);
        setError("Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading attendance...</div>
      </div>
    );
  }

  if (error) {
    return <div className="glass-card p-6 text-red-400">{error}</div>;
  }

  const overallStats = attendanceData.reduce(
    (acc, course) => {
      acc.total += course.totalClasses;
      acc.present += course.attendedClasses;
      acc.absent += course.absentClasses;
      acc.late += course.lateClasses || 0;
      return acc;
    },
    { total: 0, present: 0, absent: 0, late: 0 }
  );

  const overallPercentage =
    overallStats.total > 0
      ? ((overallStats.present / overallStats.total) * 100).toFixed(1)
      : 0;

  const getStatusBadge = status => {
    const badges = {
      present: {
        label: "Present",
        className: "bg-green-500 text-white",
        icon: "✅"
      },
      absent: {
        label: "Absent",
        className: "bg-red-500 text-white",
        icon: "❌"
      },
      late: {
        label: "Late",
        className: "bg-yellow-500 text-white",
        icon: "⏰"
      }
    };
    return badges[status] || badges.present;
  };

  return (
    <div className="fade-in space-y-6">
      <div className="glass-card p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            Attendance Records
          </h1>
          <p className="text-slate-400">
            Track your attendance across all courses
          </p>
        </div>

        <button
          onClick={downloadPDF}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          📄 Download PDF
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-6 text-center">
          <div className="text-3xl">{overallPercentage}%</div>
          <div className="text-slate-400">Attendance Rate</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="text-3xl">{overallStats.present}</div>
          <div className="text-slate-400">Present</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="text-3xl">{overallStats.absent}</div>
          <div className="text-slate-400">Absent</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="text-3xl">{overallStats.late}</div>
          <div className="text-slate-400">Late</div>
        </div>
      </div>

      {/* Table */}
      {attendanceData.map(course => (
        <div key={course.courseId} className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">{course.courseName}</h2>

          <table className="w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {course.attendanceHistory.map((r, i) => {
                const badge = getStatusBadge(r.status);
                return (
                  <tr key={i}>
                    <td>
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded ${badge.className}`}>
                        {badge.icon} {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default AttendancePage;
