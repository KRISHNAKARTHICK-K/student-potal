import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Mock users for testing
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    profilePicture: "https://via.placeholder.com/150/4F46E5/FFFFFF?text=JD",
    notifications: true,
    theme: "light"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    profilePicture: "https://via.placeholder.com/150/7C3AED/FFFFFF?text=JS",
    notifications: true,
    theme: "light"
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password; // Don't store password
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      setLoading(false);
      return { success: false, error: 'Email already exists' };
    }
    
    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      profilePicture: `https://via.placeholder.com/150/4F46E5/FFFFFF?text=${userData.name.split(' ').map(n => n[0]).join('')}`,
      notifications: true,
      theme: "light"
    };
    
    mockUsers.push(newUser);
    
    const userDataToStore = { ...newUser };
    delete userDataToStore.password;
    setUser(userDataToStore);
    localStorage.setItem('currentUser', JSON.stringify(userDataToStore));
    setLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    setLoading(false);
    if (foundUser) {
      return { success: true, message: 'Password reset link sent to your email' };
    } else {
      return { success: false, error: 'Email not found' };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};