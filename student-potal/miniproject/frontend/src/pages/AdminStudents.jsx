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

        // ✅ FIX: backend sends { success, students }
        setStudents(data.students || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch students");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const containerStyle = {
    padding: "20px",
    fontFamily: "Arial, sans-serif"
  };

  const headingStyle = {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333"
  };

  const loadingStyle = {
    fontSize: "16px",
    color: "#666",
    padding: "20px"
  };

  const errorStyle = {
    color: "#d32f2f",
    padding: "15px",
    backgroundColor: "#ffebee",
    borderRadius: "4px",
    marginBottom: "20px"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  };

  const thStyle = {
    backgroundColor: "#1976d2",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
    fontWeight: "bold",
    borderBottom: "2px solid #1565c0"
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd"
  };

  const rowStyle = (index) => ({
    backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#fff"
  });

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>Loading students...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Admin — Students</h1>

      {error && <div style={errorStyle}>Error: {error}</div>}

      {students.length === 0 ? (
        <div style={loadingStyle}>No students found</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Year</th>
              <th style={thStyle}>Roll No</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id || index} style={rowStyle(index)}>
                <td style={tdStyle}>{student.name}</td>
                <td style={tdStyle}>{student.email}</td>
                <td style={tdStyle}>{student.department}</td>
                <td style={tdStyle}>{student.year}</td>
                <td style={tdStyle}>{student.roll_no || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
