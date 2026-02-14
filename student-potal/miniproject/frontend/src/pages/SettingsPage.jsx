import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function SettingsPage({ onNavigate }) {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      phone: '',
      studentId: '',
      major: '',
      year: '',
      avatar: null
    },
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false,
        assignments: true,
        grades: true,
        announcements: true
      },
      privacy: {
        showProfile: true,
        showGrades: false,
        showAttendance: false
      }
    },
    security: {
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: 30
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Initialize settings with user data
    if (user) {
      setSettings(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          name: user.name || '',
          email: user.email || '',
          studentId: user.studentId || '',
          major: user.major || '',
          year: user.year || ''
        }
      }));
    }
  }, [user]);

  const handleSave = async (section) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (section === 'profile') {
        const result = await updateProfile(settings.profile);
        if (result.success) {
          setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
        }
      } else {
        // Save other settings (mock)
        setMessage({ type: 'success', text: `${section} settings saved successfully!` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving settings' });
    } finally {
      setLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [category]: {
          ...prev[section][category],
          [field]: value
        }
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  const renderMessage = () => {
    if (!message.text) return null;
    
    return (
      <div className={`p-4 rounded-lg mb-6 ${
        message.type === 'success' 
          ? 'bg-green-50 border border-green-200 text-green-800'
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}>
        <div className="flex items-center">
          <span className="mr-2">
            {message.type === 'success' ? '✅' : '❌'}
          </span>
          {message.text}
        </div>
      </div>
    );
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
            <input
              type="text"
              value={settings.profile.studentId}
              onChange={(e) => handleInputChange('profile', 'studentId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your student ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
            <select
              value={settings.profile.major}
              onChange={(e) => handleInputChange('profile', 'major', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select your major</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Psychology">Psychology</option>
              <option value="English">English</option>
              <option value="History">History</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
            <select
              value={settings.profile.year}
              onChange={(e) => handleInputChange('profile', 'year', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select your year</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Graduate">Graduate</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => handleSave('profile')}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? '💫' : '💾'} {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Display Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={settings.preferences.theme}
              onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="light">🌞 Light</option>
              <option value="dark">🌙 Dark</option>
              <option value="auto">🔄 Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.preferences.language}
              onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Spanish</option>
              <option value="fr">🇫🇷 French</option>
              <option value="de">🇩🇪 German</option>
              <option value="zh">🇨🇳 Chinese</option>
            </select>
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-4 mt-8">Privacy Settings</h3>
        <div className="space-y-4">
          {Object.entries(settings.preferences.privacy).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {key === 'showProfile' && '👤 Show Profile to Others'}
                  {key === 'showGrades' && '📊 Show Grades to Others'}
                  {key === 'showAttendance' && '📅 Show Attendance to Others'}
                </label>
                <p className="text-xs text-gray-500">
                  {key === 'showProfile' && 'Allow other students to see your profile information'}
                  {key === 'showGrades' && 'Allow instructors to see your grade history'}
                  {key === 'showAttendance' && 'Allow instructors to see your attendance record'}
                </p>
              </div>
              <button
                onClick={() => handleNestedInputChange('preferences', 'privacy', key, !value)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  value ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    value ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={() => handleSave('preferences')}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? '💫' : '💾'} {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
        <div className="space-y-6">
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">🔐 Two-Factor Authentication</h4>
              <button
                onClick={() => handleInputChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.security.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Add an extra layer of security to your account with two-factor authentication.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">📧 Login Notifications</h4>
              <button
                onClick={() => handleInputChange('security', 'loginNotifications', !settings.security.loginNotifications)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.security.loginNotifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.security.loginNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Receive email notifications when someone logs into your account.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">⏱️ Session Timeout</h4>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={240}>4 hours</option>
            </select>
            <p className="text-sm text-gray-600 mt-2">
              Automatically log out after period of inactivity.
            </p>
          </div>

          <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">🔑 Change Password</h4>
            <p className="text-sm text-yellow-700 mb-3">
              For security reasons, we recommend changing your password regularly.
            </p>
            <button
              onClick={() => alert('Password change functionality would be implemented here')}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm"
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => handleSave('security')}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? '💫' : '💾'} {loading ? 'Saving...' : 'Save Security Settings'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Delivery Methods</h4>
            <div className="space-y-3">
              {Object.entries(settings.preferences.notifications).filter(([key]) => ['email', 'push', 'sms'].includes(key)).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {key === 'email' && '📧 Email Notifications'}
                      {key === 'push' && '🔔 Push Notifications'}
                      {key === 'sms' && '📱 SMS Notifications'}
                    </label>
                  </div>
                  <button
                    onClick={() => handleNestedInputChange('preferences', 'notifications', key, !value)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
            <div className="space-y-3">
              {Object.entries(settings.preferences.notifications).filter(([key]) => ['assignments', 'grades', 'announcements'].includes(key)).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {key === 'assignments' && '📝 Assignment Updates'}
                      {key === 'grades' && '📊 Grade Updates'}
                      {key === 'announcements' && '📢 Announcements'}
                    </label>
                    <p className="text-xs text-gray-500">
                      {key === 'assignments' && 'New assignments, due date reminders, and submissions'}
                      {key === 'grades' && 'Grade postings and feedback from instructors'}
                      {key === 'announcements' && 'Important announcements from your courses'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNestedInputChange('preferences', 'notifications', key, !value)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => handleSave('notifications')}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? '💫' : '💾'} {loading ? 'Saving...' : 'Save Notification Settings'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="mt-2 text-gray-600">Manage your account preferences and security settings</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('profile')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                👤 View Profile
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                🏠 Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderMessage()}
        
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;