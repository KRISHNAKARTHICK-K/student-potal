import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function SettingsPage() {
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
      theme: 'dark',
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
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (section === 'profile') {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/c6339c77-b22b-4115-9342-816106701d48',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SettingsPage.jsx:68',message:'About to call updateProfile',data:{section:'profile'},timestamp:Date.now(),runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        const result = await updateProfile(settings.profile);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/c6339c77-b22b-4115-9342-816106701d48',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SettingsPage.jsx:70',message:'updateProfile result received',data:{success:result.success,hasError:!!result.error,hasMessage:!!result.message,error:result.error,message:result.message},timestamp:Date.now(),runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        if (result.success) {
          setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } else {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/c6339c77-b22b-4115-9342-816106701d48',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SettingsPage.jsx:73',message:'Setting error message',data:{usingError:!!result.error,usingMessage:!!result.message,errorValue:result.error,messageValue:result.message},timestamp:Date.now(),runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
          setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
        }
      } else {
        setMessage({ type: 'success', text: `${section} settings saved successfully!` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving settings' });
    } finally {
      setLoading(false);
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
      <div className={`glass-card p-4 mb-6 ${
        message.type === 'success' 
          ? 'border-green-500/50 bg-green-500/10'
          : 'border-red-500/50 bg-red-500/10'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{message.type === 'success' ? '✅' : '❌'}</span>
          <span className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {message.text}
          </span>
        </div>
      </div>
    );
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
        enabled ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-slate-700'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Student ID</label>
            <input
              type="text"
              value={settings.profile.studentId}
              onChange={(e) => handleInputChange('profile', 'studentId', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="Enter your student ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Major</label>
            <select
              value={settings.profile.major}
              onChange={(e) => handleInputChange('profile', 'major', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            >
              <option value="">Select your major</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Academic Year</label>
            <select
              value={settings.profile.year}
              onChange={(e) => handleInputChange('profile', 'year', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
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
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '💫 Saving...' : '💾 Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Display Preferences
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Theme</label>
            <select
              value={settings.preferences.theme}
              onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
              className="w-full max-w-xs px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            >
              <option value="light">🌞 Light</option>
              <option value="dark">🌙 Dark</option>
              <option value="auto">🔄 Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Language</label>
            <select
              value={settings.preferences.language}
              onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
              className="w-full max-w-xs px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            >
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Spanish</option>
              <option value="fr">🇫🇷 French</option>
            </select>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-4 mt-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Privacy Settings
        </h3>
        <div className="space-y-4">
          {Object.entries(settings.preferences.privacy).map(([key, value]) => (
            <div key={key} className="glass-card p-4 flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-white">
                  {key === 'showProfile' && '👤 Show Profile to Others'}
                  {key === 'showGrades' && '📊 Show Grades to Others'}
                  {key === 'showAttendance' && '📅 Show Attendance to Others'}
                </label>
                <p className="text-xs text-slate-400 mt-1">
                  {key === 'showProfile' && 'Allow other students to see your profile information'}
                  {key === 'showGrades' && 'Allow instructors to see your grade history'}
                  {key === 'showAttendance' && 'Allow instructors to see your attendance record'}
                </p>
              </div>
              <ToggleSwitch
                enabled={value}
                onChange={(val) => handleNestedInputChange('preferences', 'privacy', key, val)}
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={() => handleSave('preferences')}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? '💫 Saving...' : '💾 Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Account Security
        </h3>
        <div className="space-y-4">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white">🔐 Two-Factor Authentication</h4>
              <ToggleSwitch
                enabled={settings.security.twoFactorAuth}
                onChange={(val) => handleInputChange('security', 'twoFactorAuth', val)}
              />
            </div>
            <p className="text-sm text-slate-400">
              Add an extra layer of security to your account with two-factor authentication.
            </p>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white">📧 Login Notifications</h4>
              <ToggleSwitch
                enabled={settings.security.loginNotifications}
                onChange={(val) => handleInputChange('security', 'loginNotifications', val)}
              />
            </div>
            <p className="text-sm text-slate-400">
              Receive email notifications when someone logs into your account.
            </p>
          </div>

          <div className="glass-card p-4">
            <h4 className="font-medium text-white mb-2">⏱️ Session Timeout</h4>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full max-w-xs px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
            <p className="text-sm text-slate-400 mt-2">
              Automatically log out after period of inactivity.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => handleSave('security')}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? '💫 Saving...' : '💾 Save Security Settings'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Notification Preferences
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-white mb-3">Delivery Methods</h4>
            <div className="space-y-3">
              {Object.entries(settings.preferences.notifications)
                .filter(([key]) => ['email', 'push', 'sms'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="glass-card p-4 flex items-center justify-between">
                    <label className="text-sm font-medium text-white">
                      {key === 'email' && '📧 Email Notifications'}
                      {key === 'push' && '🔔 Push Notifications'}
                      {key === 'sms' && '📱 SMS Notifications'}
                    </label>
                    <ToggleSwitch
                      enabled={value}
                      onChange={(val) => handleNestedInputChange('preferences', 'notifications', key, val)}
                    />
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-3">Notification Types</h4>
            <div className="space-y-3">
              {Object.entries(settings.preferences.notifications)
                .filter(([key]) => ['assignments', 'grades', 'announcements'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="glass-card p-4 flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-white">
                        {key === 'assignments' && '📝 Assignment Updates'}
                        {key === 'grades' && '📊 Grade Updates'}
                        {key === 'announcements' && '📢 Announcements'}
                      </label>
                      <p className="text-xs text-slate-400 mt-1">
                        {key === 'assignments' && 'New assignments, due date reminders, and submissions'}
                        {key === 'grades' && 'Grade postings and feedback from instructors'}
                        {key === 'announcements' && 'Important announcements from your courses'}
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={value}
                      onChange={(val) => handleNestedInputChange('preferences', 'notifications', key, val)}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => handleSave('notifications')}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? '💫 Saving...' : '💾 Save Notification Settings'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Settings
        </h1>
        <p className="text-slate-400">Manage your account preferences and security settings</p>
      </div>

      {renderMessage()}
      
      <div className="glass-card overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-700/50">
          <nav className="flex space-x-1 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-4 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
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
  );
}

export default SettingsPage;