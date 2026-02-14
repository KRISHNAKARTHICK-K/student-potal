import React, { useEffect, useState } from "react";
import api from "../services/api";

function TeacherAttendancePage() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const fetchStudents = async () => {
    if (!department || !year) return;

    setLoading(true);
    try {
      const res = await api.get(
        `/admin/students/class?department=${department}&year=${year}`
      );
      setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const submitAttendance = async () => {
    try {
      for (const id in attendance) {
        await api.post("/attendance/mark", {
          student_id: id,
          date: today,
          status: attendance[id]
        });
      }

      setMessage("✅ Attendance submitted");
    } catch {
      setMessage("❌ Failed to submit");
    }
  };

  return (
    <div className="p-6">

      {/* Class Selector */}
      <div className="bg-white p-4 shadow rounded mb-6 flex gap-4">

        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Department</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
        </select>

        <select
          value={year}
          onChange={e => setYear(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Year</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        <button
          onClick={fetchStudents}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Load Class
        </button>
      </div>

      {/* Students */}
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>Name</th>
              <th>Roll</th>
              <th>Present</th>
              <th>Absent</th>
            </tr>
          </thead>

          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.roll_no}</td>

                <td>
                  <input
                    type="radio"
                    name={s.id}
                    onChange={() => handleStatusChange(s.id, "present")}
                  />
                </td>

                <td>
                  <input
                    type="radio"
                    name={s.id}
                    onChange={() => handleStatusChange(s.id, "absent")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={submitAttendance}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
      >
        Submit
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

export default TeacherAttendancePage;
