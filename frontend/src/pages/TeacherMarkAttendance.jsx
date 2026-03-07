import React, { useState } from "react";

const API = "http://localhost:5000/api";

export default function TeacherMarkAttendance() {
  const token = localStorage.getItem("token");

  // ✅ Complete Department List
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

  const [department, setDepartment] = useState("IT");
  const [year, setYear] = useState("1");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadStudents = async () => {
    if (!token) {
      setMessage("❌ Not authorized. Please login again.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${API}/admin/students/class?department=${department}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) throw new Error("Failed to fetch students");

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setStudents(data.students || []);
      setAttendance({});
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to load students");
    }

    setLoading(false);
  };

  const mark = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const submitAttendance = async () => {
    if (!token) {
      setMessage("❌ Not authorized.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const today = new Date().toISOString().split("T")[0];

      let successCount = 0;
      let failCount = 0;

      for (const student of students) {
        const status = attendance[student.id];
        if (!status) continue;

        const res = await fetch(`${API}/attendance/mark`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            student_id: student.id,
            date: today,
            status
          })
        });

        const data = await res.json();

        if (data.success) successCount++;
        else failCount++;
      }

      if (failCount === 0) {
        setMessage(`✅ Attendance submitted (${successCount} students)`);
      } else {
        setMessage(
          `⚠️ Partial success: ${successCount} saved, ${failCount} failed`
        );
      }

      setAttendance({});
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit attendance");
    }

    setLoading(false);
  };

  return (
    <div className="fade-in space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text">
          Mark Attendance
        </h1>
        <p className="text-slate-400">
          Record student attendance for your class
        </p>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">

          {/* Department Dropdown */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200"
          >
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>

          <button
            onClick={loadStudents}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          >
            {loading ? "Loading..." : "Load Class"}
          </button>
        </div>
      </div>

      {students.length > 0 && (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-4 text-white">{s.name}</td>
                  <td className="px-6 py-4 text-slate-300">
                    {s.roll_no || "—"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="radio"
                      name={`att-${s.id}`}
                      checked={attendance[s.id] === "present"}
                      onChange={() => mark(s.id, "present")}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="radio"
                      name={`att-${s.id}`}
                      checked={attendance[s.id] === "absent"}
                      onChange={() => mark(s.id, "absent")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {students.length > 0 && (
        <div className="glass-card p-6 flex justify-between">
          <p className="text-slate-400">
            Marked: {Object.keys(attendance).length}/{students.length}
          </p>

          <button
            onClick={submitAttendance}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-green-600 text-white"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}

      {message && (
        <div className="glass-card p-4 text-center text-sm text-white">
          {message}
        </div>
      )}
    </div>
  );
}