import React from "react";

export default function TeacherDashboard({ onNavigate }) {
  const cardStyle = {
    background: "#ffffff",
    padding: "18px",
    borderRadius: "10px",
    marginBottom: "12px",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
    transition: "all 0.2s ease"
  };

  const hover = (e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
  };

  const leave = (e) => {
    e.currentTarget.style.transform = "translateY(0px)";
  };

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>Teacher Dashboard</h1>

      {/* Mark Attendance */}
      <div
        style={cardStyle}
        onClick={() => onNavigate("teacher-attendance")}
        onMouseEnter={hover}
        onMouseLeave={leave}
      >
        <h3>📋 Mark Attendance</h3>
        <p>Record student attendance for today</p>
      </div>

      {/* Export PDF */}
      <div
        style={cardStyle}
        onClick={() => onNavigate("teacher-summary")}
        onMouseEnter={hover}
        onMouseLeave={leave}
      >
        <h3>📄 Export PDF</h3>
        <p>Download class attendance report</p>
      </div>

      {/* Students */}
      <div
        style={cardStyle}
        onClick={() => onNavigate("teacher-students")}
        onMouseEnter={hover}
        onMouseLeave={leave}
      >
        <h3>👥 Students</h3>
        <p>View students in your class</p>
      </div>
    </div>
  );
}
