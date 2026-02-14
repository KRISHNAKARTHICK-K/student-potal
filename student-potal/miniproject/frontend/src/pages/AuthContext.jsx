import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

// Create Auth Context
export const AuthContext = createContext();

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // LOGIN (Backend)
const login = async (email, password) => {
  try {
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message };
    }

    // 🔥 THIS IS THE FIX
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);

    return { success: true };
  } catch (err) {
    return { success: false, message: "Login failed" };
  } finally {
    setLoading(false);
  }
};


  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // PLACEHOLDERS (optional, keep for now)
  const signup = async () => {
    return { success: false, error: "Signup not implemented yet" };
  };

  const forgotPassword = async () => {
    return { success: false, error: "Forgot password not implemented yet" };
  };

  const updateProfile = async () => {
    return { success: false, error: "Profile update not implemented yet" };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        forgotPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
