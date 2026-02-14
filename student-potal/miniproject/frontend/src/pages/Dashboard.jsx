import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function Dashboard({ onNavigate }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading with realistic mock data
    setTimeout(() => {
      const mockStats = {
        currentGPA: 3.75,
        totalCourses: 6,
        attendanceRate: 89,
        pendingTasks: 4,
        completedAssignments: 23,
        upcomingExams: 2
      };

      const mockActivities = [
        {
          id: 1,
          type: 'assignment',
          title: 'Math Assignment 3 submitted',
          time: '2 hours ago',
          icon: '📝'
        },
        {
          id: 2,
          type: 'grade',
          title: 'Physics Quiz - Grade: A-',
          time: '1 day ago',
          icon: '📊'
        },
        {
          id: 3,
          type: 'attendance',
          title: 'Attended Chemistry Lab',
          time: '2 days ago',
          icon: '🔬'
        },
        {
          id: 4,
          type: 'resource',
          title: 'Downloaded Study Guide',
          time: '3 days ago',
          icon: '📚'
        }
      ];

      const mockEvents = [
        {
          id: 1,
          title: 'Math Final Exam',
          date: '2025-10-15',
          time: '10:00 AM',
          type: 'exam',
          icon: '📝'
        },
        {
          id: 2,
          title: 'Physics Assignment Due',
          date: '2025-10-12',
          time: '11:59 PM',
          type: 'assignment',
          icon: '⏰'
        },
        {
          id: 3,
          title: 'Chemistry Lab Session',
          date: '2025-10-11',
          time: '2:00 PM',
          type: 'class',
          icon: '🔬'
        }
      ];

      setStats(mockStats);
      setRecentActivities(mockActivities);
      setUpcomingEvents(mockEvents);
      setLoading(false);
    }, 500);
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
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="card-body">
            <h3>Loading dashboard...</h3>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <h1>Welcome back, {getFirstName()}! 👋</h1>
          <p>Here's what's happening with your academic journey today.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2">
        <div className="card">
          <div className="card-body">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{stats.currentGPA}</div>
            <div className="stat-label">Current GPA</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{stats.totalCourses}</div>
            <div className="stat-label">Total Courses</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="stat-icon">📅</div>
            <div className="stat-value">{stats.attendanceRate}%</div>
            <div className="stat-label">Attendance Rate</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="stat-icon">⏰</div>
            <div className="stat-value">{stats.pendingTasks}</div>
            <div className="stat-label">Pending Tasks</div>
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
              📚 My Courses
            </button>
            <button 
              onClick={() => onNavigate('assignments')}
              className="btn btn-primary"
            >
              📝 Assignments
            </button>
            <button 
              onClick={() => onNavigate('grades')}
              className="btn btn-primary"
            >
              📊 Grades
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Activities</h2>
          </div>
          <div className="card-body">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <span className="activity-icon">{activity.icon}</span>
                <div className="activity-content">
                  <h4>{activity.title}</h4>
                  <p>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="card-header">
            <h2>Upcoming Events</h2>
          </div>
          <div className="card-body">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="event-item">
                <span className="event-icon">{event.icon}</span>
                <div className="event-content">
                  <h4>{event.title}</h4>
                  <p>{formatDate(event.date)} • {event.time}</p>
                  <span className={`event-badge event-${event.type}`}>
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="card">
        <div className="card-header">
          <h2>Academic Progress</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-3">
            <div className="progress-item">
              <h3>Assignments</h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${(stats.completedAssignments / (stats.completedAssignments + stats.pendingTasks)) * 100}%` 
                  }}
                ></div>
              </div>
              <p>{stats.completedAssignments} completed, {stats.pendingTasks} pending</p>
            </div>

            <div className="progress-item">
              <h3>Attendance</h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${stats.attendanceRate}%` }}
                ></div>
              </div>
              <p>{stats.attendanceRate}% overall rate</p>
            </div>

            <div className="progress-item">
              <h3>Exams</h3>
              <div className="exam-count">
                <span className="exam-number">{stats.upcomingExams}</span>
                <span className="exam-label">upcoming</span>
              </div>
              <p>this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;