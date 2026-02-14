import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function HomePage({ onNavigate }) {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [quickStats, setQuickStats] = useState({});

  useEffect(() => {
    // Mock data for homepage
    const mockAnnouncements = [
      {
        id: 1,
        title: 'Welcome to Student Portal!',
        content: 'We\'re excited to have you here. Explore all the features available to enhance your academic journey.',
        date: '2025-10-08',
        type: 'welcome',
        priority: 'high'
      },
      {
        id: 2,
        title: 'System Maintenance Scheduled',
        content: 'Scheduled maintenance will occur this weekend. Some services may be temporarily unavailable.',
        date: '2025-10-09',
        type: 'maintenance',
        priority: 'medium'
      },
      {
        id: 3,
        title: 'New Features Available',
        content: 'Check out the updated profile section with enhanced customization options.',
        date: '2025-10-07',
        type: 'feature',
        priority: 'low'
      }
    ];

    const mockEvents = [
      {
        id: 1,
        title: 'Mathematics Final Exam',
        date: '2025-10-15',
        time: '10:00 AM',
        type: 'exam',
        course: 'MATH201'
      },
      {
        id: 2,
        title: 'Physics Assignment Due',
        date: '2025-10-12',
        time: '11:59 PM',
        type: 'assignment',
        course: 'PHYS150'
      },
      {
        id: 3,
        title: 'Career Fair',
        date: '2025-10-20',
        time: '9:00 AM - 4:00 PM',
        type: 'event',
        course: 'General'
      },
      {
        id: 4,
        title: 'Chemistry Lab Session',
        date: '2025-10-11',
        time: '2:00 PM',
        type: 'class',
        course: 'CHEM101'
      }
    ];

    const mockStats = {
      totalCourses: 6,
      currentGPA: 3.75,
      attendanceRate: 89,
      completedAssignments: 23,
      pendingTasks: 4,
      upcomingExams: 2
    };

    setAnnouncements(mockAnnouncements);
    setUpcomingEvents(mockEvents);
    setQuickStats(mockStats);
  }, []);

  // Safe user name handling
  const getUserName = () => {
    if (user && user.name && typeof user.name === 'string') {
      return user.name;
    }
    return 'Student';
  };

  const getFirstName = () => {
    const fullName = getUserName();
    if (fullName && typeof fullName === 'string') {
      const nameParts = fullName.split(' ');
      return nameParts[0] || 'Student';
    }
    return 'Student';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-yellow-400 bg-yellow-50';
      case 'low': return 'border-blue-400 bg-blue-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'exam': return '📝';
      case 'assignment': return '📋';
      case 'class': return '🎓';
      case 'event': return '🎪';
      case 'welcome': return '🎉';
      case 'maintenance': return '🔧';
      case 'feature': return '✨';
      default: return '📅';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'exam': return 'text-red-600 bg-red-100';
      case 'assignment': return 'text-yellow-600 bg-yellow-100';
      case 'class': return 'text-blue-600 bg-blue-100';
      case 'event': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome, {getFirstName()}! 🌟
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Your gateway to academic excellence and success
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                🏠 Go to Dashboard
              </button>
              <button
                onClick={() => onNavigate('courses')}
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200"
              >
                📚 View My Courses
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current GPA</p>
                <p className="text-3xl font-bold text-blue-600">{quickStats.currentGPA}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => onNavigate('grades')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View detailed grades →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-3xl font-bold text-green-600">{quickStats.attendanceRate}%</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => onNavigate('attendance')}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                View attendance details →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-3xl font-bold text-purple-600">{quickStats.pendingTasks}</p>
              </div>
              <div className="text-4xl">⏰</div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => onNavigate('assignments')}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Manage assignments →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-gray-600">Access your most-used features</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              
              <button
                onClick={() => onNavigate('courses')}
                className="flex flex-col items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200 group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">📚</div>
                <span className="text-sm font-medium text-blue-900">My Courses</span>
              </button>

              <button
                onClick={() => onNavigate('assignments')}
                className="flex flex-col items-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200 group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">📝</div>
                <span className="text-sm font-medium text-green-900">Assignments</span>
              </button>

              <button
                onClick={() => onNavigate('grades')}
                className="flex flex-col items-center p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors duration-200 group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">🎯</div>
                <span className="text-sm font-medium text-purple-900">Grades</span>
              </button>

              <button
                onClick={() => onNavigate('timetable')}
                className="flex flex-col items-center p-4 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200 group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">⏰</div>
                <span className="text-sm font-medium text-yellow-900">Schedule</span>
              </button>

              <button
                onClick={() => onNavigate('resources')}
                className="flex flex-col items-center p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200 group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">📖</div>
                <span className="text-sm font-medium text-indigo-900">Resources</span>
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="flex flex-col items-center p-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors duration-200 group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">📞</div>
                <span className="text-sm font-medium text-red-900">Support</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Announcements */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">📢 Latest Announcements</h2>
              <button
                onClick={() => onNavigate('announcements')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View all →
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {announcements.slice(0, 3).map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`border-l-4 p-4 rounded-r-lg ${getPriorityColor(announcement.priority)}`}
                  >
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">{getTypeIcon(announcement.type)}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{announcement.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{announcement.content}</p>
                        <p className="text-xs text-gray-500">{formatDate(announcement.date)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">📅 Upcoming Events</h2>
              <button
                onClick={() => onNavigate('timetable')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Full calendar →
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingEvents.slice(0, 4).map((event) => (
                  <div key={event.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mr-4">{getTypeIcon(event.type)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
                      <p className="text-gray-600 text-xs">{event.course} • {event.time}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(event.type)}`}>
                        {formatDate(event.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg text-white">
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🚀 Explore New Features</h2>
                <p className="text-indigo-100 mb-4">
                  Discover powerful tools to enhance your learning experience
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => onNavigate('resources')}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                  >
                    📚 Study Resources
                  </button>
                  <button
                    onClick={() => onNavigate('profile')}
                    className="bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
                  >
                    👤 Update Profile
                  </button>
                </div>
              </div>
              <div className="hidden md:block text-8xl opacity-20">
                🎓
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg">
          <div className="p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">💡</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Need Help Getting Started?</h2>
              <p className="text-gray-600 mb-6">
                Explore our comprehensive help resources or contact support
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => onNavigate('contact')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  📞 Contact Support
                </button>
                <button
                  onClick={() => onNavigate('resources')}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                  📚 Browse Help Docs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;