import React from 'react';
import { useAuth } from './AuthContext';

function Navigation({ onNavigate, currentPage }) {
  const { user, logout } = useAuth();

  // Safe user name handling
  const getUserInitial = () => {
    if (user && user.name && typeof user.name === 'string') {
      return user.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    if (user && user.name && typeof user.name === 'string') {
      return user.name;
    }
    return 'User';
  };

  const handleLogout = () => {
    logout();
    onNavigate('signup');
  };

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { key: 'home', label: 'Home', icon: '🏡' },
    { key: 'courses', label: 'Courses', icon: '📚' },
    { key: 'grades', label: 'Grades', icon: '📊' },
    { key: 'attendance', label: 'Attendance', icon: '📅' },
    { key: 'assignments', label: 'Assignments', icon: '📝' },
    { key: 'timetable', label: 'Timetable', icon: '⏰' },
    { key: 'resources', label: 'Resources', icon: '📖' },
    { key: 'announcements', label: 'Announcements', icon: '📢' },
    { key: 'contact', label: 'Contact', icon: '📞' },
  ];

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '1rem 0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          ✨ Student Portal
        </div>
        
        {/* Menu Items */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                border: 'none',
                background: currentPage === item.key ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== item.key) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== item.key) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        
        {/* User Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginLeft: '1rem',
          paddingLeft: '1rem',
          borderLeft: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <button 
            onClick={() => onNavigate('profile')} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              color: 'white',
              border: 'none'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.25)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              {getUserInitial()}
            </div>
            <span>{getUserName()}</span>
          </button>
          
          <button 
            onClick={() => onNavigate('settings')} 
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            ⚙️
          </button>
          
          <button 
            onClick={handleLogout} 
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              color: 'white',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)'
            }}
            onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)'}
            onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)'}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;