import React, { useState, useEffect } from 'react';
import { useAuth } from '../pages/AuthContext';

function UserProfile({ onNavigate }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Simulate loading user profile data
    setTimeout(() => {
      // Mock user profile data
      const mockProfile = {
        id: 12345,
        name: 'Alex Johnson',
        email: 'alex.johnson@student.edu',
        studentId: 'STU2025001',
        major: 'Computer Science',
        year: 'Junior',
        gpa: 3.75,
        avatar: null,
        joinDate: '2023-09-01',
        phone: '+1 (555) 123-4567',
        address: '123 Campus Drive, University City',
        emergencyContact: 'Sarah Johnson - (555) 987-6543'
      };
      
      setUserProfile(mockProfile);
      setLoading(false);
    }, 500);
  }, []);

  // Safe user name extraction
  const getUserDisplayName = () => {
    if (userProfile && userProfile.name && typeof userProfile.name === 'string') {
      return userProfile.name;
    }
    if (user && user.name && typeof user.name === 'string') {
      return user.name;
    }
    return 'Student';
  };

  const getUserEmail = () => {
    if (userProfile && userProfile.email && typeof userProfile.email === 'string') {
      return userProfile.email;
    }
    if (user && user.email && typeof user.email === 'string') {
      return user.email;
    }
    return 'student@university.edu';
  };

  const getInitials = () => {
    const name = getUserDisplayName();
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return nameParts[0].charAt(0) + nameParts[1].charAt(0);
    }
    return name.charAt(0) || 'S';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="card-body">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      {/* Profile Header */}
      <div className="card">
        <div className="card-header">
          <div className="profile-header">
            <div className="avatar-large">
              {getInitials()}
            </div>
            <div className="profile-info">
              {/* ✅ FIXED: Render individual properties, not the whole object */}
              <h1>{getUserDisplayName()}</h1>
              <p className="profile-subtitle">{getUserEmail()}</p>
              <p className="profile-meta">
                {userProfile?.major} • {userProfile?.year} • GPA: {userProfile?.gpa}
              </p>
            </div>
            <div className="profile-actions">
              <button 
                onClick={() => onNavigate('settings')}
                className="btn btn-primary"
              >
                ⚙️ Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h2>Personal Information</h2>
          </div>
          <div className="card-body">
            <div className="profile-field">
              <label>Full Name</label>
              <p>{getUserDisplayName()}</p>
            </div>
            <div className="profile-field">
              <label>Email Address</label>
              <p>{getUserEmail()}</p>
            </div>
            <div className="profile-field">
              <label>Student ID</label>
              <p>{userProfile?.studentId || 'N/A'}</p>
            </div>
            <div className="profile-field">
              <label>Phone Number</label>
              <p>{userProfile?.phone || 'Not provided'}</p>
            </div>
            <div className="profile-field">
              <label>Address</label>
              <p>{userProfile?.address || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Academic Information</h2>
          </div>
          <div className="card-body">
            <div className="profile-field">
              <label>Major</label>
              <p>{userProfile?.major || 'Undeclared'}</p>
            </div>
            <div className="profile-field">
              <label>Academic Year</label>
              <p>{userProfile?.year || 'N/A'}</p>
            </div>
            <div className="profile-field">
              <label>Current GPA</label>
              <p className="gpa-display">{userProfile?.gpa || '0.00'}</p>
            </div>
            <div className="profile-field">
              <label>Enrollment Date</label>
              <p>{userProfile?.joinDate ? new Date(userProfile.joinDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="profile-field">
              <label>Emergency Contact</label>
              <p>{userProfile?.emergencyContact || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h2>Recent Activity</h2>
        </div>
        <div className="card-body">
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">📝</span>
              <div className="activity-content">
                <h4>Profile viewed</h4>
                <p>Just now</p>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📊</span>
              <div className="activity-content">
                <h4>GPA updated</h4>
                <p>2 days ago</p>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">⚙️</span>
              <div className="activity-content">
                <h4>Settings updated</h4>
                <p>1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-3">
            <button 
              onClick={() => onNavigate('courses')}
              className="btn btn-primary"
            >
              📚 View Courses
            </button>
            <button 
              onClick={() => onNavigate('grades')}
              className="btn btn-primary"
            >
              📊 Check Grades
            </button>
            <button 
              onClick={() => onNavigate('settings')}
              className="btn btn-primary"
            >
              ⚙️ Account Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;