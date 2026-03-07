import React, { useState } from "react";
import api from "../services/api";

function TeacherAttendancePage() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  /* ===============================
     Department List
  =============================== */
  const departments = [
    "IT",
    "AIDS",
    "CSE",
    "MECH",
    "EIE",
    "ECE",
    "RA",
    "CIVIL",
    "EEE",
    "BME",
    "AERO"
  ];

  /* ===============================
     Fetch Students
  =============================== */
  const fetchStudents = async () => {
    if (!department || !year) {
      setMessage("❌ Please select department and year");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // ⚠️ IMPORTANT: baseURL already has /api
      const res = await api.get(
        `/admin/students/class?department=${department}&year=${year}`
      );

      console.log("Backend Response:", res.data);

      if (res.data.students.length === 0) {
        setMessage("⚠️ No students found for selected class");
      }

      setStudents(res.data.students || []);
      setAttendance({});
    } catch (err) {
      console.error("Fetch students error:", err.response?.data || err);
      setMessage(
        err.response?.data?.message || "❌ Failed to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     Handle Attendance Change
  =============================== */
  const handleStatusChange = (id, status) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  /* ===============================
     Submit Attendance
  =============================== */
  const submitAttendance = async () => {
    try {
      setLoading(true);
      setMessage("");

      const courseId = 1; // TEMP (change later)

      for (const id in attendance) {
        await api.post("/attendance/mark", {
          student_id: Number(id),
          course_id: courseId,
          date: today,
          status: attendance[id],
        });
      }

      setMessage("✅ Attendance submitted successfully");
      setAttendance({});
    } catch (err) {
      console.error("Attendance error:", err.response?.data || err);
      setMessage(
        err.response?.data?.message || "❌ Failed to submit attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in space-y-6">

      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text">
          Mark Attendance
        </h1>
        <p className="text-slate-400">
          Record student attendance for today ({today})
        </p>
      </div>

      {/* Class Selector */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">

          {/* Department */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Year */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white"
          >
            <option value="">Select Year</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>

          {/* Load Button */}
          <button
            onClick={fetchStudents}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          >
            {loading ? "Loading..." : "Load Class"}
          </button>

        </div>

        {/* Message */}
        {message && (
          <p className="mt-4 text-sm text-yellow-400">{message}</p>
        )}
      </div>

      {/* Students Table */}
      {students.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-lg font-bold text-white">
              Students ({students.length})
            </h2>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-6 py-3 text-left text-slate-400">Name</th>
                <th className="px-6 py-3 text-left text-slate-400">Roll No</th>
                <th className="px-6 py-3 text-center text-slate-400">Present</th>
                <th className="px-6 py-3 text-center text-slate-400">Absent</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-4 text-white">{s.name}</td>
                  <td className="px-6 py-4 text-slate-300">
                    {s.roll_no || "—"}
                  </td>
                  <td className="text-center">
                    <input
                      type="radio"
                      name={`attendance-${s.id}`}
                      checked={attendance[s.id] === "present"}
                      onChange={() =>
                        handleStatusChange(s.id, "present")
                      }
                    />
                  </td>
                  <td className="text-center">
                    <input
                      type="radio"
                      name={`attendance-${s.id}`}
                      checked={attendance[s.id] === "absent"}
                      onChange={() =>
                        handleStatusChange(s.id, "absent")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-6">
            <button
              onClick={submitAttendance}
              className="px-6 py-2.5 rounded-lg bg-green-500 text-white"
            >
              Submit Attendance
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default TeacherAttendancePage;