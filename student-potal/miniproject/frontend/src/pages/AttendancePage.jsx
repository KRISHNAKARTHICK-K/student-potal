import React, { useState, useEffect } from "react";
import api from "../services/api";

function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [viewMode, setViewMode] = useState("summary");
  const [loading, setLoading] = useState(true);
  const [error, setError] = "";

  /* =========================
     DOWNLOAD PDF
  ========================= */
  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/attendance/pdf",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

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

  /* =========================
     FETCH ATTENDANCE
  ========================= */
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);

        const res = await api.get("/attendance/my");
        const records = res.data.attendance || [];

        const totalClasses = records.length;
        const attendedClasses = records.filter(
          (r) => r.status === "present"
        ).length;
        const absentClasses = records.filter(
          (r) => r.status === "absent"
        ).length;

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
            attendancePercentage,
            status:
              attendancePercentage >= 75 ? "good" : "warning",
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

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const overallStats = attendanceData.reduce(
    (acc, course) => {
      acc.total += course.totalClasses;
      acc.present += course.attendedClasses;
      acc.absent += course.absentClasses;
      return acc;
    },
    { total: 0, present: 0, absent: 0 }
  );

  const overallPercentage =
    overallStats.total > 0
      ? ((overallStats.present / overallStats.total) * 100).toFixed(1)
      : 0;

  const getIcon = (status) =>
    status === "present" ? "✅" : "❌";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow p-6">
        <h1 className="text-3xl font-bold">Attendance</h1>

        <button
          onClick={downloadPDF}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download Attendance PDF
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6">

        {/* SUMMARY */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <p>Attendance %</p>
            <h2 className="text-2xl font-bold">
              {overallPercentage}%
            </h2>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <p>Present</p>
            <h2 className="text-2xl font-bold text-green-600">
              {overallStats.present}
            </h2>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <p>Absent</p>
            <h2 className="text-2xl font-bold text-red-600">
              {overallStats.absent}
            </h2>
          </div>
        </div>

        {/* TABLE */}
        {attendanceData.map((course) => (
          <div key={course.courseId} className="bg-white p-6 rounded shadow">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {course.attendanceHistory.map((r, i) => (
                  <tr key={i}>
                    <td className="border p-2">
                      {new Date(r.date).toISOString().split("T")[0]}
                    </td>
                    <td className="border p-2">
                      {getIcon(r.status)} {r.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttendancePage;
