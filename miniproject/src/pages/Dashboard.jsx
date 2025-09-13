import React from 'react';
import { useAuth } from './AuthContext';
import Navigation from './Navigation';

const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();

  const quickLinks = [
    {
      title: 'My Profile',
      description: 'View and edit your personal information',
      icon: '👤',
      action: () => onNavigate('profile'),
      color: '#3b82f6'
    },
    {
      title: 'Settings',
      description: 'Manage your account preferences',
      icon: '⚙️',
      action: () => onNavigate('settings'),
      color: '#8b5cf6'
    },
    {
      title: 'Academic Records',
      description: 'View your grades and transcripts',
      icon: '📊',
      action: () => alert('Feature coming soon!'),
      color: '#10b981'
    },
    {
      title: 'Course Schedule',
      description: 'Check your class timetable',
      icon: '📅',
      action: () => alert('Feature coming soon!'),
      color: '#f59e0b'
    },
    {
      title: 'Library Resources',
      description: 'Access digital books and journals',
      icon: '📚',
      action: () => alert('Feature coming soon!'),
      color: '#ef4444'
    },
    {
      title: 'Student Support',
      description: 'Get help and support services',
      icon: '🎓',
      action: () => alert('Feature coming soon!'),
      color: '#06b6d4'
    }
  ];

  const announcements = [
    {
      title: 'Welcome to Student Portal!',
      message: 'We\'re excited to have you here. Explore all the features available to enhance your academic journey.',
      date: 'Today',
      type: 'welcome'
    },
    {
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur this weekend. Some services may be temporarily unavailable.',
      date: '2 days ago',
      type: 'info'
    },
    {
      title: 'New Features Available',
      message: 'Check out the updated profile section with enhanced customization options.',
      date: '1 week ago',
      type: 'update'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navigation currentPage="dashboard" onNavigate={onNavigate} />
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem 1rem' 
      }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: '0.5rem' 
          }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#6b7280' 
          }}>
            Here's what's happening with your academic journey today.
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <p style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: '#3b82f6', 
                  margin: 0 
                }}>
                  4.2
                </p>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  margin: 0 
                }}>
                  Current GPA
                </p>
              </div>
              <div style={{ 
                fontSize: '2rem', 
                opacity: 0.3 
              }}>
                📊
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <p style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: '#10b981', 
                  margin: 0 
                }}>
                  6
                </p>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  margin: 0 
                }}>
                  Courses
                </p>
              </div>
              <div style={{ 
                fontSize: '2rem', 
                opacity: 0.3 
              }}>
                📚
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <p style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: '#f59e0b', 
                  margin: 0 
                }}>
                  89%
                </p>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  margin: 0 
                }}>
                  Attendance
                </p>
              </div>
              <div style={{ 
                fontSize: '2rem', 
                opacity: 0.3 
              }}>
                📅
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '2rem',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Quick Links */}
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: '1rem' 
            }}>
              Quick Actions
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '1rem' 
            }}>
              {quickLinks.map((link, index) => (
                <div
                  key={index}
                  onClick={link.action}
                  style={{ 
                    backgroundColor: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', 
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.borderColor = link.color + '20';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '1rem' 
                  }}>
                    <div style={{ 
                      fontSize: '2rem',
                      padding: '0.5rem',
                      backgroundColor: link.color + '10',
                      borderRadius: '8px',
                      minWidth: '3rem',
                      textAlign: 'center'
                    }}>
                      {link.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: '600', 
                        color: '#111827', 
                        margin: '0 0 0.5rem 0' 
                      }}>
                        {link.title}
                      </h3>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280', 
                        margin: 0 
                      }}>
                        {link.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: '1rem' 
            }}>
              Announcements
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {announcements.map((announcement, index) => (
                <div
                  key={index}
                  style={{ 
                    backgroundColor: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    borderLeft: `4px solid ${
                      announcement.type === 'welcome' ? '#3b82f6' :
                      announcement.type === 'info' ? '#f59e0b' : '#10b981'
                    }`
                  }}
                >
                  <h3 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    color: '#111827', 
                    margin: '0 0 0.5rem 0' 
                  }}>
                    {announcement.title}
                  </h3>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    margin: '0 0 0.5rem 0',
                    lineHeight: '1.4'
                  }}>
                    {announcement.message}
                  </p>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: '#9ca3af',
                    fontWeight: '500'
                  }}>
                    {announcement.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;