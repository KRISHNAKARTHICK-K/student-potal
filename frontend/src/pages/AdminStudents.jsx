import React, { useState, useEffect } from "react";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/admin/students",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setStudents(data.students || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch students");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Admin — Students
        </h1>
        <p className="text-slate-400">Manage all registered students</p>
      </div>

      {error && (
        <div className="glass-card p-4 border-red-500/50 bg-red-500/10 text-red-400">
          Error: {error}
        </div>
      )}

      {students.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-white mb-2">No students found</h3>
          <p className="text-slate-400">No students are currently registered in the system.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Student List ({students.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Roll No
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {students.map((student, index) => (
                  <tr 
                    key={student.id || index} 
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {student.department || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {student.year || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {student.roll_no || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}