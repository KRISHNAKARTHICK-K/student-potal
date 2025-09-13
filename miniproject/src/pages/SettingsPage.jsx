import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Navigation from './Navigation';

const SettingsPage = ({ onNavigate }) => {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState({
    notifications: user?.notifications || true,
    theme: user?.theme || 'light',
    emailUpdates: true,
    smsNotifications: false,
    weeklyDigest: true
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleSettingChange = (settingName, value) => {
    const newSettings = {
      ...settings,
      [settingName]: value
    };
    setSettings(newSettings);
    
    // Update user preferences
    updateUser(newSettings);
    
    setSuccessMessage('Settings updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const settingSections = [
    {
      title: 'Account Preferences',
      settings: [
        {
          name: 'notifications',
          label: 'Enable Notifications',
          description: 'Receive notifications about important updates and deadlines',
          type: 'toggle'
        },
        {
          name: 'theme',
          label: 'Theme',
          description: 'Choose your preferred interface theme',
          type: 'select',
          options: [
            { value: 'light', label: 'Light Mode' },
            { value: 'dark', label: 'Dark Mode' },
            { value: 'auto', label: 'System Default' }
          ]
        }
      ]
    },
    {
      title: 'Communication Preferences',
      settings: [
        {
          name: 'emailUpdates',
          label: 'Email Updates',
          description: 'Receive important updates via email',
          type: 'toggle'
        },
        {
          name: 'smsNotifications',
          label: 'SMS Notifications',
          description: 'Get urgent notifications via SMS',
          type: 'toggle'
        },
        {
          name: 'weeklyDigest',
          label: 'Weekly Digest',
          description: 'Receive a weekly summary of your activities',
          type: 'toggle'
        }
      ]
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navigation currentPage="settings" onNavigate={onNavigate} />
      
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem 1rem' 
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#111827', 
          marginBottom: '2rem' 
        }}>
          Settings
        </h1>

        {successMessage && (
          <div style={{ 
            backgroundColor: '#f0fdf4', 
            color: '#16a34a', 
            padding: '0.75rem 1rem', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            fontSize: '0.875rem',
            border: '1px solid #bbf7d0'
          }}>
            {successMessage}
          </div>
        )}

        {settingSections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', 
              padding: '2rem',
              marginBottom: '2rem'
            }}
          >
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#111827', 
              marginBottom: '1.5rem' 
            }}>
              {section.title}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {section.settings.map((setting, index) => (
                <div
                  key={index}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '1rem 0',
                    borderBottom: index < section.settings.length - 1 ? '1px solid #f3f4f6' : 'none'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      color: '#111827', 
                      margin: '0 0 0.25rem 0' 
                    }}>
                      {setting.label}
                    </h3>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280', 
                      margin: 0 
                    }}>
                      {setting.description}
                    </p>
                  </div>

                  <div style={{ marginLeft: '2rem' }}>
                    {setting.type === 'toggle' ? (
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        cursor: 'pointer' 
                      }}>
                        <input
                          type="checkbox"
                          checked={settings[setting.name]}
                          onChange={(e) => handleSettingChange(setting.name, e.target.checked)}
                          style={{ display: 'none' }}
                        />
                        <div style={{ 
                          width: '44px', 
                          height: '24px', 
                          borderRadius: '12px', 
                          backgroundColor: settings[setting.name] ? '#3b82f6' : '#e5e7eb',
                          position: 'relative',
                          transition: 'background-color 0.2s'
                        }}>
                          <div style={{ 
                            width: '20px', 
                            height: '20px', 
                            borderRadius: '50%', 
                            backgroundColor: 'white',
                            position: 'absolute',
                            top: '2px',
                            left: settings[setting.name] ? '22px' : '2px',
                            transition: 'left 0.2s',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                          }} />
                        </div>
                      </label>
                    ) : (
                      <select
                        value={settings[setting.name]}
                        onChange={(e) => handleSettingChange(setting.name, e.target.value)}
                        style={{ 
                          padding: '0.5rem 1rem', 
                          border: '2px solid #e5e7eb', 
                          borderRadius: '6px', 
                          fontSize: '0.875rem',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        {setting.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Account Management */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', 
          padding: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '1.5rem' 
          }}>
            Account Management
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <div>
                <h3 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: '#111827', 
                  margin: '0 0 0.25rem 0' 
                }}>
                  Export Data
                </h3>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  margin: 0 
                }}>
                  Download a copy of your account data
                </p>
              </div>
              <button
                onClick={() => alert('Data export feature coming soon!')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
              >
                Export
              </button>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '1rem',
              backgroundColor: '#fef2f2',
              borderRadius: '8px',
              border: '1px solid #fecaca'
            }}>
              <div>
                <h3 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: '#dc2626', 
                  margin: '0 0 0.25rem 0' 
                }}>
                  Delete Account
                </h3>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#991b1b', 
                  margin: 0 
                }}>
                  Permanently delete your account and all data
                </p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    alert('Account deletion feature coming soon!');
                  }
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', 
          padding: '2rem',
          marginTop: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '1.5rem' 
          }}>
            Help & Support
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {[
              { title: 'Contact Support', icon: '📧', description: 'Get help from our support team' },
              { title: 'User Guide', icon: '📚', description: 'Learn how to use the portal' },
              { title: 'FAQs', icon: '❓', description: 'Find answers to common questions' },
              { title: 'Report Issue', icon: '🐛', description: 'Report bugs or technical issues' }
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => alert(`${item.title} feature coming soon!`)}
                style={{ 
                  padding: '1.5rem', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  border: '2px solid transparent'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.borderColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {item.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: '#111827', 
                  margin: '0 0 0.5rem 0' 
                }}>
                  {item.title}
                </h3>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  margin: 0 
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;