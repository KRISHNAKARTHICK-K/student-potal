import React, { useState, useEffect } from 'react';

function CoursesPage({ onNavigate }) {
  const [courses, setCourses] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    // Mock courses data
    const mockCourses = [
      {
        id: 1,
        code: 'CS101',
        name: 'Introduction to Computer Science',
        instructor: 'Dr. Sarah Johnson',
        credits: 3,
        semester: 'Fall 2025',
        status: 'active',
        progress: 75,
        grade: 'A-',
        nextAssignment: 'Programming Assignment 3',
        nextAssignmentDue: '2025-10-15',
        schedule: 'MWF 9:00-10:00 AM',
        room: 'CS Building 201',
        description: 'Fundamental concepts of computer science including programming, algorithms, and data structures.',
        enrollmentCount: 45,
        maxEnrollment: 50,
        prerequisites: 'None',
        color: '#3b82f6'
      },
      {
        id: 2,
        code: 'MATH201',
        name: 'Calculus II',
        instructor: 'Prof. Michael Chen',
        credits: 4,
        semester: 'Fall 2025',
        status: 'active',
        progress: 82,
        grade: 'B+',
        nextAssignment: 'Problem Set 5',
        nextAssignmentDue: '2025-10-18',
        schedule: 'TTh 11:00-12:30 PM',
        room: 'Math Building 105',
        description: 'Advanced calculus including integration techniques, series, and multivariable calculus.',
        enrollmentCount: 38,
        maxEnrollment: 40,
        prerequisites: 'MATH101',
        color: '#ef4444'
      },
      {
        id: 3,
        code: 'PHYS150',
        name: 'General Physics I',
        instructor: 'Dr. Lisa Anderson',
        credits: 4,
        semester: 'Fall 2025',
        status: 'active',
        progress: 68,
        grade: 'B',
        nextAssignment: 'Lab Report 3',
        nextAssignmentDue: '2025-10-20',
        schedule: 'MWF 2:00-3:00 PM, Lab: T 3:00-5:00 PM',
        room: 'Physics Building 301',
        description: 'Introduction to mechanics, waves, and thermodynamics with laboratory component.',
        enrollmentCount: 32,
        maxEnrollment: 35,
        prerequisites: 'MATH101',
        color: '#10b981'
      },
      {
        id: 4,
        code: 'ENG102',
        name: 'English Composition',
        instructor: 'Prof. David Wilson',
        credits: 3,
        semester: 'Fall 2025',
        status: 'active',
        progress: 90,
        grade: 'A',
        nextAssignment: 'Research Paper',
        nextAssignmentDue: '2025-10-25',
        schedule: 'TTh 9:30-11:00 AM',
        room: 'Liberal Arts 210',
        description: 'Development of writing skills through various forms of composition and critical analysis.',
        enrollmentCount: 28,
        maxEnrollment: 30,
        prerequisites: 'ENG101',
        color: '#f59e0b'
      },
      {
        id: 5,
        code: 'HIST101',
        name: 'World History',
        instructor: 'Dr. Maria Rodriguez',
        credits: 3,
        semester: 'Fall 2025',
        status: 'active',
        progress: 55,
        grade: 'B-',
        nextAssignment: 'Midterm Exam',
        nextAssignmentDue: '2025-10-22',
        schedule: 'MWF 1:00-2:00 PM',
        room: 'History Building 150',
        description: 'Survey of world civilizations from ancient times to the present.',
        enrollmentCount: 42,
        maxEnrollment: 45,
        prerequisites: 'None',
        color: '#8b5cf6'
      },
      {
        id: 6,
        code: 'CHEM101',
        name: 'General Chemistry',
        instructor: 'Dr. Robert Kim',
        credits: 4,
        semester: 'Fall 2025',
        status: 'active',
        progress: 71,
        grade: 'B+',
        nextAssignment: 'Lab Practical',
        nextAssignmentDue: '2025-10-17',
        schedule: 'MWF 10:00-11:00 AM, Lab: W 2:00-5:00 PM',
        room: 'Chemistry Building 120',
        description: 'Fundamental principles of chemistry including atomic structure, bonding, and reactions.',
        enrollmentCount: 35,
        maxEnrollment: 36,
        prerequisites: 'MATH101',
        color: '#06b6d4'
      }
    ];

    setCourses(mockCourses);
    setFilteredCourses(mockCourses);
  }, []);

  // Filter courses based on search term and semester
  useEffect(() => {
    let filtered = courses;

    // Filter by semester
    if (selectedSemester !== 'all') {
      filtered = filtered.filter(course => {
        if (selectedSemester === 'current') {
          return course.status === 'active';
        }
        return course.semester.toLowerCase().includes(selectedSemester.toLowerCase());
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  }, [courses, selectedSemester, searchTerm]);

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10b981';
    if (progress >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return '#10b981';
    if (grade.startsWith('B')) return '#3b82f6';
    if (grade.startsWith('C')) return '#f59e0b';
    return '#ef4444';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div 
        className="h-2"
        style={{ backgroundColor: course.color }}
      ></div>
      
      <div className="p-6">
        {/* Course Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center mb-2">
              <span 
                className="px-2 py-1 text-xs font-semibold rounded"
                style={{ 
                  backgroundColor: course.color + '20', 
                  color: course.color 
                }}
              >
                {course.code}
              </span>
              <span className="ml-2 text-xs text-gray-500">{course.credits} credits</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h3>
            <p className="text-sm text-gray-600">{course.instructor}</p>
          </div>
          <div className="text-right">
            <div 
              className="text-lg font-bold mb-1"
              style={{ color: getGradeColor(course.grade) }}
            >
              {course.grade}
            </div>
            <div className="text-xs text-gray-500">{course.semester}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${course.progress}%`,
                backgroundColor: getProgressColor(course.progress)
              }}
            ></div>
          </div>
        </div>

        {/* Course Info */}
        <div className="text-sm text-gray-600 mb-4">
          <div className="flex items-center mb-1">
            <span className="mr-2">📅</span>
            <span>{course.schedule}</span>
          </div>
          <div className="flex items-center mb-1">
            <span className="mr-2">📍</span>
            <span>{course.room}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">👥</span>
            <span>{course.enrollmentCount}/{course.maxEnrollment} enrolled</span>
          </div>
        </div>

        {/* Next Assignment */}
        {course.nextAssignment && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
            <div className="flex items-center">
              <span className="mr-2">⏰</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">{course.nextAssignment}</p>
                <p className="text-xs text-yellow-600">Due: {formatDate(course.nextAssignmentDue)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('assignments')}
            className="flex-1 px-3 py-2 text-xs font-medium text-white rounded-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: course.color }}
          >
            View Assignments
          </button>
          <button
            onClick={() => onNavigate('grades')}
            className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Grades
          </button>
          <button
            onClick={() => onNavigate('resources')}
            className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Resources
          </button>
        </div>
      </div>
    </div>
  );

  const CourseListItem = ({ course }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div 
            className="w-4 h-16 rounded"
            style={{ backgroundColor: course.color }}
          ></div>
          <div>
            <div className="flex items-center mb-1">
              <span 
                className="px-2 py-1 text-xs font-semibold rounded mr-2"
                style={{ 
                  backgroundColor: course.color + '20', 
                  color: course.color 
                }}
              >
                {course.code}
              </span>
              <span className="text-xs text-gray-500">{course.credits} credits</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
            <div className="text-xs text-gray-500">
              {course.schedule} • {course.room}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Progress</div>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="h-2 rounded-full"
                  style={{ 
                    width: `${course.progress}%`,
                    backgroundColor: getProgressColor(course.progress)
                  }}
                ></div>
              </div>
              <span className="text-xs font-medium">{course.progress}%</span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Grade</div>
            <div 
              className="text-lg font-bold"
              style={{ color: getGradeColor(course.grade) }}
            >
              {course.grade}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('assignments')}
              className="px-3 py-1 text-xs font-medium text-white rounded hover:opacity-90"
              style={{ backgroundColor: course.color }}
            >
              Assignments
            </button>
            <button
              onClick={() => onNavigate('grades')}
              className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Grades
            </button>
          </div>
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
              <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
              <p className="mt-2 text-gray-600">Track your academic progress and manage coursework</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('timetable')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                📅 View Schedule
              </button>
              <button
                onClick={() => onNavigate('resources')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                📚 Resources
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="current">Current Semester</option>
                <option value="all">All Semesters</option>
                <option value="fall">Fall 2025</option>
                <option value="spring">Spring 2025</option>
                <option value="summer">Summer 2025</option>
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm font-medium ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🔲 Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  📝 List
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>
        </div>

        {/* Courses Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <CourseListItem key={course.id} course={course} />
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? `No courses match your search "${searchTerm}"`
                : 'No courses available for the selected semester'
              }
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSemester('current');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-blue-600">
              {(courses.reduce((sum, course) => sum + parseFloat(course.grade.replace(/[+-]/g, '')), 0) / courses.length || 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Average GPA</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-green-600">
              {courses.reduce((sum, course) => sum + course.credits, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Credits</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length || 0)}%
            </div>
            <div className="text-sm text-gray-600">Avg Progress</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-purple-600">
              {courses.filter(course => course.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Courses</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;