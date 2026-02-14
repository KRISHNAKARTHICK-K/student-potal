import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: '🏠' },
    { path: '/courses', name: 'Courses', icon: '📚' },
    { path: '/attendance', name: 'Attendance', icon: '📅' },
    { path: '/grades', name: 'Grades', icon: '📊' },
    { path: '/assignments', name: 'Assignments', icon: '📝' },
    { path: '/timetable', name: 'Timetable', icon: '⏰' },
    { path: '/ai-chat', name: 'AI Chat', icon: '🤖' },
    { path: '/resources', name: 'Resources', icon: '📖' },
    { path: '/settings', name: 'Settings', icon: '⚙️' }
  ];

  const adminItems = [
    { path: '/admin/dashboard', name: 'Admin Dashboard', icon: '👑' },
    { path: '/admin/students', name: 'Manage Students', icon: '👥' },
    { path: '/admin/courses', name: 'Manage Courses', icon: '📚' },
    { path: '/admin/announcements', name: 'Announcements', icon: '📢' },
    { path: '/reports', name: 'Reports', icon: '📈' },
    { path: '/statistics', name: 'Statistics', icon: '📊' }
  ];

  const isActiveLink = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Student Portal</h1>
          <button 
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 overflow-y-auto h-full pb-20">
          {/* Main Menu */}
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Student Menu
            </h3>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActiveLink(item.path)
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Admin Menu */}
          <div className="mt-8 space-y-1">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Admin Panel
            </h3>
            {adminItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActiveLink(item.path)
                    ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;