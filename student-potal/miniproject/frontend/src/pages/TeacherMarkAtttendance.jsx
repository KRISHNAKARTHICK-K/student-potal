import React, { useState } from "react";

const API = "http://localhost:5000/api"; // change if needed

export default function TeacherMarkAttendance() {
  const token = localStorage.getItem("token");

  const [department, setDepartment] = useState("CSE");
  const [year, setYear] = useState("1");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ===================== LOAD STUDENTS ===================== */
  const loadStudents = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${API}/admin/students/class?department=${department}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setStudents(data.students);
      setAttendance({});
    } catch (err) {
      setMessage("Failed to load students");
    }

    setLoading(false);
  };

  /* ===================== MARK ATTENDANCE ===================== */
  const mark = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  /* ===================== SUBMIT ===================== */
  const submitAttendance = async () => {
    setLoading(true);
    setMessage("");

    try {
      const today = new Date().toISOString().split("T")[0];

      for (const student of students) {
        const status = attendance[student.id];
        if (!status) continue;

        await fetch(`${API}/attendance/mark`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            student_id: student.id,
            course_id: 1, // change when course system ready
            date: today,
            status,
          }),
        });
      }

      setMessage("✅ Attendance submitted");
    } catch (err) {
      setMessage("❌ Failed to submit attendance");
    }

    setLoading(false);
  };

  /* ===================== UI ===================== */
  return (
    <div>
      <h2>Mark Attendance</h2>

      <div style={{ marginBottom: 12 }}>
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>

        <button onClick={loadStudents} disabled={loading}>
          Load Class
        </button>
      </div>

      {students.length > 0 && (
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll</th>
              <th>Present</th>
              <th>Absent</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.roll_no}</td>
                <td>
                  <input
                    type="radio"
                    name={`att-${s.id}`}
                    onChange={() => mark(s.id, "present")}
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    name={`att-${s.id}`}
                    onChange={() => mark(s.id, "absent")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {students.length > 0 && (
        <button onClick={submitAttendance} disabled={loading}>
          Submit Attendance
        </button>
      )}

      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
