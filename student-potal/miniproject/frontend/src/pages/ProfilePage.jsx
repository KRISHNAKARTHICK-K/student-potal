import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navigation from "./Navigation";

const ProfilePage = ({ onNavigate }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/student/profile");

        setProfile(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  const user = profile.user;
  const student = profile.student;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navigation currentPage="profile" onNavigate={onNavigate} />

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem 1rem"
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#111827",
            marginBottom: "2rem"
          }}
        >
          My Profile
        </h1>

        {/* Profile Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            padding: "2rem"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              marginBottom: "2rem"
            }}
          >
            <img
              src="https://via.placeholder.com/100/3b82f6/ffffff?text=U"
              alt="Profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%"
              }}
            />

            <div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: "0.5rem"
                }}
              >
                {user.name}
              </h3>
              <p style={{ color: "#6b7280", margin: 0 }}>
                Student ID: STU-{user.id.toString().padStart(6, "0")}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem"
            }}
          >
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <p className="mt-1 text-gray-900">{user.name}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <p className="mt-1 text-gray-900">{user.email}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Role
              </label>
              <p className="mt-1 text-gray-900">{user.role}</p>
            </div>

            {student && (
              <>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Department
                  </label>
                  <p className="mt-1 text-gray-900">{student.department}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Year
                  </label>
                  <p className="mt-1 text-gray-900">{student.year}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Roll Number
                  </label>
                  <p className="mt-1 text-gray-900">{student.roll_no}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
