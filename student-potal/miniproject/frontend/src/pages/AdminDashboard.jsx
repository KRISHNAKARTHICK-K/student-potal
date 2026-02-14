import React, { useState, useEffect } from "react";

function AdminDashboard() {
  /* =======================
     STATE
     ======================= */
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: "—",
    totalFaculty: "—",
    totalAnnouncements: "—"
  });

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentError, setStudentError] = useState("");

  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    department: "",
    year: "",
    roll_no: ""
  });
  const [saving, setSaving] = useState(false);

  /* =======================
     FETCH STUDENTS (REAL DATA)
     ======================= */
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/admin/students",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch students");
      }

      setStudents(data.students || []);
      setStats(prev => ({
        ...prev,
        totalStudents: data.students.length
      }));
    } catch (err) {
      setStudentError(err.message);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* =======================
     EDIT HANDLERS (ADMIN ONLY)
     ======================= */
  const startEdit = (student) => {
    setEditingStudent(student.id);
    setFormData({
      department: student.department || "",
      year: student.year || "",
      roll_no: student.roll_no || ""
    });
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setFormData({ department: "", year: "", roll_no: "" });
  };

  const saveEdit = async (userId) => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/admin/students/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      await fetchStudents();
      cancelEdit();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Administrative control panel
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Students" value={stats.totalStudents} icon="👥" />
          <StatCard title="Courses" value={stats.totalCourses} icon="📚" />
          <StatCard title="Faculty" value={stats.totalFaculty} icon="👨‍🏫" />
          <StatCard title="Announcements" value={stats.totalAnnouncements} icon="📢" />
        </div>

        {/* STUDENT LIST */}
        <div className="bg-white rounded-lg shadow mt-10">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Registered Students
            </h2>
          </div>

          <div className="p-6">
            {loadingStudents && <p>Loading students...</p>}
            {studentError && <p className="text-red-600">{studentError}</p>}

            {!loadingStudents && !studentError && (
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead className="bg-gray-100">
                    <tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Department</Th>
                      <Th>Year</Th>
                      <Th>Roll No</Th>
                      <Th>Action</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id} className="border-t">
                        <Td>{student.name}</Td>
                        <Td>{student.email}</Td>

                        <Td>
                          {editingStudent === student.id ? (
                            <input
                              value={formData.department}
                              onChange={e =>
                                setFormData({ ...formData, department: e.target.value })
                              }
                            />
                          ) : (
                            student.department || "—"
                          )}
                        </Td>

                        <Td>
                          {editingStudent === student.id ? (
                            <input
                              type="number"
                              value={formData.year}
                              onChange={e =>
                                setFormData({ ...formData, year: e.target.value })
                              }
                            />
                          ) : (
                            student.year || "—"
                          )}
                        </Td>

                        <Td>
                          {editingStudent === student.id ? (
                            <input
                              value={formData.roll_no}
                              onChange={e =>
                                setFormData({ ...formData, roll_no: e.target.value })
                              }
                            />
                          ) : (
                            student.roll_no || "—"
                          )}
                        </Td>

                        <Td>
                          {editingStudent === student.id ? (
                            <>
                              <button
                                onClick={() => saveEdit(student.id)}
                                disabled={saving}
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                style={{ marginLeft: 8 }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button onClick={() => startEdit(student)}>
                              Edit
                            </button>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* =======================
   REUSABLE COMPONENTS
   ======================= */
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center">
    <span className="text-2xl mr-4">{icon}</span>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

const Th = ({ children }) => (
  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-4 py-2 text-sm text-gray-900">
    {children}
  </td>
);

export default AdminDashboard;
