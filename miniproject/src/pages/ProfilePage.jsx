import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Navigation from './Navigation';

const ProfilePage = ({ onNavigate }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        name: user?.name || '',
        email: user?.email || ''
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
    setSuccessMessage('');
  };

  const handleSave = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    updateUser(formData);
    setIsEditing(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePasswordChange = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // In a real app, you'd validate current password and update
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangingPassword(false);
    setSuccessMessage('Password changed successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navigation currentPage="profile" onNavigate={onNavigate} />
      
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
          My Profile
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

        {/* Profile Information */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', 
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#111827', 
              margin: 0 
            }}>
              Profile Information
            </h2>
            <button
              onClick={handleEditToggle}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: isEditing ? '#ef4444' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = isEditing ? '#dc2626' : '#2563eb';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = isEditing ? '#ef4444' : '#3b82f6';
              }}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <img
              src={user?.profilePicture || 'https://via.placeholder.com/100/3b82f6/ffffff?text=U'}
              alt="Profile"
              style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#111827', 
                margin: '0 0 0.5rem 0' 
              }}>
                {user?.name}
              </h3>
              <p style={{ 
                fontSize: '1rem', 
                color: '#6b7280', 
                margin: 0 
              }}>
                Student ID: STU-{user?.id?.toString().padStart(6, '0')}
              </p>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '0.5rem' 
              }}>
                Full Name
              </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: errors.name ? '2px solid #ef4444' : '2px solid #e5e7eb', 
                      borderRadius: '8px', 
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                  {errors.name && (
                    <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {errors.name}
                    </p>
                  )}
                </>
              ) : (
                <p style={{ 
                  fontSize: '1rem', 
                  color: '#111827', 
                  margin: 0,
                  padding: '0.75rem 0'
                }}>
                  {user?.name}
                </p>
              )}
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '0.5rem' 
              }}>
                Email Address
              </label>
              {isEditing ? (
                <>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: errors.email ? '2px solid #ef4444' : '2px solid #e5e7eb', 
                      borderRadius: '8px', 
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                  {errors.email && (
                    <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {errors.email}
                    </p>
                  )}
                </>
              ) : (
                <p style={{ 
                  fontSize: '1rem', 
                  color: '#111827', 
                  margin: 0,
                  padding: '0.75rem 0'
                }}>
                  {user?.email}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '2rem' 
            }}>
              <button
                onClick={handleSave}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', 
          padding: '2rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#111827', 
              margin: 0 
            }}>
              Change Password
            </h2>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: isChangingPassword ? '#ef4444' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = isChangingPassword ? '#dc2626' : '#2563eb';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = isChangingPassword ? '#ef4444' : '#3b82f6';
              }}
            >
              {isChangingPassword ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {isChangingPassword && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem' 
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '0.5rem' 
                }}>
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: errors.currentPassword ? '2px solid #ef4444' : '2px solid #e5e7eb', 
                    borderRadius: '8px', 
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                {errors.currentPassword && (
                  <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '0.5rem' 
                }}>
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: errors.newPassword ? '2px solid #ef4444' : '2px solid #e5e7eb', 
                    borderRadius: '8px', 
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                {errors.newPassword && (
                  <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '0.5rem' 
                }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: errors.confirmPassword ? '2px solid #ef4444' : '2px solid #e5e7eb', 
                    borderRadius: '8px', 
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                {errors.confirmPassword && (
                  <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <button
                  onClick={handlePasswordChange}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;