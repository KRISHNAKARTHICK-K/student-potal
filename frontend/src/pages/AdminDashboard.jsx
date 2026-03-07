import React, { useState, useEffect } from "react";

function AdminDashboard() {
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
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Admin Dashboard
        </h1>
        <p className="text-slate-400">Administrative control panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Students" value={stats.totalStudents} icon="👥" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Courses" value={stats.totalCourses} icon="📚" gradient="from-green-500 to-emerald-500" />
        <StatCard title="Faculty" value={stats.totalFaculty} icon="👨‍🏫" gradient="from-yellow-500 to-orange-500" />
        <StatCard title="Announcements" value={stats.totalAnnouncements} icon="📢" gradient="from-purple-500 to-pink-500" />
      </div>

      {/* Student List */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Registered Students
          </h2>
        </div>

        <div className="p-6">
          {loadingStudents && (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-400">Loading students...</div>
            </div>
          )}
          
          {studentError && (
            <div className="glass-card p-4 border-red-500/50 bg-red-500/10 text-red-400">
              {studentError}
            </div>
          )}

          {!loadingStudents && !studentError && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Department</Th>
                    <Th>Year</Th>
                    <Th>Roll No</Th>
                    <Th>Action</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    students.map(student => (
                      <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                        <Td className="font-medium text-white">{student.name}</Td>
                        <Td className="text-slate-300">{student.email}</Td>

                        <Td>
                          {editingStudent === student.id ? (
                            <input
                              value={formData.department}
                              onChange={e =>
                                setFormData({ ...formData, department: e.target.value })
                              }
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                          ) : (
                            <span className="text-slate-300">{student.department || "—"}</span>
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
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                          ) : (
                            <span className="text-slate-300">{student.year || "—"}</span>
                          )}
                        </Td>

                        <Td>
                          {editingStudent === student.id ? (
                            <input
                              value={formData.roll_no}
                              onChange={e =>
                                setFormData({ ...formData, roll_no: e.target.value })
                              }
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                          ) : (
                            <span className="text-slate-300">{student.roll_no || "—"}</span>
                          )}
                        </Td>

                        <Td>
                          {editingStudent === student.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveEdit(student.id)}
                                disabled={saving}
                                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50"
                              >
                                {saving ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => startEdit(student)}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                            >
                              Edit
                            </button>
                          )}
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, gradient }) => (
  <div className="glass-card-hover p-6 group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg`}>
        {icon}
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-slate-400 uppercase tracking-wider">{title}</div>
      </div>
    </div>
  </div>
);

const Th = ({ children }) => (
  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-sm ${className}`}>
    {children}
  </td>
);

export default AdminDashboard;