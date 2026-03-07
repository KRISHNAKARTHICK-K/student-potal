import React, { useEffect, useState } from "react";
import api from "../services/api";

function TeacherAttendanceSummary() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [courseId, setCourseId] = useState("");
  const [year, setYear] = useState("");

  const fetchSummary = async () => {
    if (!courseId || !year) return;

    setLoading(true);
    try {
      const res = await api.get(
        `/attendance/summary?course_id=${courseId}&year=${year}`
      );

      setData(res.data.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/attendance/teacher/pdf?course_id=${courseId}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) throw new Error("PDF failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance_report.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("PDF download failed");
    }
  };

  return (
    <div className="fade-in space-y-6">

      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text">
          Class Attendance Summary
        </h1>
        <p className="text-slate-400">
          Select course and year to view attendance analytics
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 flex gap-4 flex-wrap">
        <input
          type="number"
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="px-4 py-2 rounded bg-slate-800 text-white"
        />

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-4 py-2 rounded bg-slate-800 text-white"
        >
          <option value="">Select Year</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>

        <button
          onClick={fetchSummary}
          className="px-6 py-2 rounded bg-blue-600 text-white"
        >
          Load Summary
        </button>

        <button
          onClick={downloadPDF}
          disabled={!data.length}
          className="px-6 py-2 rounded bg-purple-600 text-white"
        >
          Export PDF
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass-card p-10 text-center text-slate-400">
          Loading summary...
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3">Roll</th>
                <th className="p-3">Total</th>
                <th className="p-3 text-green-400">Present</th>
                <th className="p-3 text-red-400">Absent</th>
                <th className="p-3">%</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-500">
                    No attendance data
                  </td>
                </tr>
              ) : (
                data.map((s) => (
                  <tr key={s.student_id} className="border-t border-slate-800">
                    <td className="p-3">{s.name}</td>
                    <td className="p-3 text-center">{s.roll_no}</td>
                    <td className="p-3 text-center">{s.total_classes}</td>
                    <td className="p-3 text-center text-green-400 font-bold">
                      {s.present}
                    </td>
                    <td className="p-3 text-center text-red-400 font-bold">
                      {s.absent}
                    </td>
                    <td className="p-3 text-center font-bold">
                      {s.percentage}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TeacherAttendanceSummary;
