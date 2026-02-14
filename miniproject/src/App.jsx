import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './pages/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SingupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Main App Router Component
const AppRouter = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');

  // Simple routing based on authentication state
  useEffect(() => {
    if (user) {
      // If user is logged in and on auth pages, redirect to dashboard
      if (['login', 'signup', 'forgot-password'].includes(currentPage)) {
        setCurrentPage('dashboard');
      }
    } else {
      // If user is not logged in and on protected pages, redirect to login
      if (['dashboard', 'profile', 'settings'].includes(currentPage)) {
        setCurrentPage('login');
      }
    }
  }, [user, currentPage]);

  // Navigation function
  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Render current page based on authentication state and current page
  const renderPage = () => {
    // If user is not authenticated, show auth pages
    if (!user) {
      switch (currentPage) {
        case 'signup':
          return <SignupPage onNavigate={handleNavigate} />;
        case 'forgot-password':
          return <ForgotPasswordPage onNavigate={handleNavigate} />;
        default:
          return <LoginPage onNavigate={handleNavigate} />;
      }
    }

    // If user is authenticated, show app pages
    switch (currentPage) {
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
    }}>
      {renderPage()}
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;