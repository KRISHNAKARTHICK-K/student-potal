import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
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
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 text-red-400">{error}</div>
    );
  }

  if (!profile) {
    return (
      <div className="glass-card p-6 text-slate-400">No profile data available</div>
    );
  }

  const profileUser = profile.user || user;
  const student = profile.student;

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          My Profile
        </h1>
        <p className="text-slate-400">View and manage your profile information</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg border-4 border-slate-700/50">
            {profileUser?.name ? profileUser.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {profileUser?.name || "User"}
            </h3>
            <p className="text-slate-400">
              Student ID: STU-{profileUser?.id?.toString().padStart(6, "0") || "000000"}
            </p>
            <span className="inline-block mt-2 px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 text-sm font-semibold border border-blue-500/30">
              {profileUser?.role || "student"}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <p className="text-white text-lg">{profileUser?.name || "—"}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Email
            </label>
            <p className="text-white text-lg">{profileUser?.email || "—"}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Role
            </label>
            <p className="text-white text-lg capitalize">{profileUser?.role || "—"}</p>
          </div>

          {student && (
            <>
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Department
                </label>
                <p className="text-white text-lg">{student.department || "—"}</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Year
                </label>
                <p className="text-white text-lg">{student.year || "—"}</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Roll Number
                </label>
                <p className="text-white text-lg">{student.roll_no || "—"}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;