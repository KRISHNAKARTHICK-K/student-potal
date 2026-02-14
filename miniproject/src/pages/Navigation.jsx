import React from 'react';
import { useAuth } from './AuthContext';

const Navigation = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: 'dashboard', icon: '🏠' },
    { name: 'Profile', path: 'profile', icon: '👤' },
    { name: 'Settings', path: 'settings', icon: '⚙️' }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={{ 
      backgroundColor: 'white', 
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
      padding: '0 1rem' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        height: '64px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#3b82f6', 
            margin: 0 
          }}>
            Student Portal
          </h1>
        </div>

        {/* Navigation Links */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2rem' 
        }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: currentPage === item.path ? '#3b82f6' : '#6b7280',
                backgroundColor: currentPage === item.path ? '#eff6ff' : 'transparent',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (currentPage !== item.path) {
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.color = '#374151';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== item.path) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6b7280';
                }
              }}
            >
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>

        {/* User Menu */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
          }}>
            <img
              src={user?.profilePicture || 'https://via.placeholder.com/32/3b82f6/ffffff?text=U'}
              alt="Profile"
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%' 
              }}
            />
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151' 
            }}>
              {user?.name || 'Student'}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f9fafb';
              e.target.style.borderColor = '#d1d5db';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#e5e7eb';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;