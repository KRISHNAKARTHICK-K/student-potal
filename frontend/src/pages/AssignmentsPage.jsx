import React, { useState, useEffect } from 'react';

function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    course: 'all',
    priority: 'all'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Mock assignments data
    const mockAssignments = [
      {
        id: 1,
        title: 'Programming Assignment 1: Hello World',
        courseId: 'CS101',
        courseName: 'Introduction to Computer Science',
        instructor: 'Dr. Sarah Johnson',
        description: 'Create a simple "Hello World" program in Python with proper documentation and comments.',
        dueDate: '2025-10-15T23:59:00',
        submittedDate: '2025-10-14T18:30:00',
        status: 'submitted',
        priority: 'medium',
        points: 50,
        earnedPoints: 45,
        grade: 'A-',
        feedback: 'Excellent work! Clean code structure and good documentation. Minor improvement needed in variable naming.',
        attachments: ['hello_world.py'],
        submissionType: 'file',
        allowLateSubmission: true
      },
      {
        id: 2,
        title: 'Calculus Problem Set 3',
        courseId: 'MATH201',
        courseName: 'Calculus II',
        instructor: 'Prof. Michael Chen',
        description: 'Solve integration problems using substitution method and integration by parts.',
        dueDate: '2025-10-18T23:59:00',
        submittedDate: null,
        status: 'pending',
        priority: 'high',
        points: 75,
        earnedPoints: null,
        grade: null,
        feedback: null,
        attachments: [],
        submissionType: 'file',
        allowLateSubmission: false
      },
      {
        id: 3,
        title: 'Physics Lab Report 2',
        courseId: 'PHYS150',
        courseName: 'General Physics I',
        instructor: 'Dr. Lisa Anderson',
        description: 'Write a comprehensive lab report on the pendulum experiment including data analysis and conclusions.',
        dueDate: '2025-10-20T17:00:00',
        submittedDate: null,
        status: 'pending',
        priority: 'medium',
        points: 100,
        earnedPoints: null,
        grade: null,
        feedback: null,
        attachments: [],
        submissionType: 'file',
        allowLateSubmission: true
      },
      {
        id: 4,
        title: 'Essay: American Literature Analysis',
        courseId: 'ENG102',
        courseName: 'English Composition',
        instructor: 'Prof. David Wilson',
        description: 'Write a 1500-word analysis of themes in contemporary American literature.',
        dueDate: '2025-10-25T23:59:00',
        submittedDate: null,
        status: 'pending',
        priority: 'high',
        points: 150,
        earnedPoints: null,
        grade: null,
        feedback: null,
        attachments: [],
        submissionType: 'text',
        allowLateSubmission: true
      },
      {
        id: 5,
        title: 'History Research Project',
        courseId: 'HIST101',
        courseName: 'World History',
        instructor: 'Dr. Maria Rodriguez',
        description: 'Research and present on a significant historical event from the 20th century.',
        dueDate: '2025-11-01T23:59:00',
        submittedDate: null,
        status: 'pending',
        priority: 'low',
        points: 200,
        earnedPoints: null,
        grade: null,
        feedback: null,
        attachments: [],
        submissionType: 'file',
        allowLateSubmission: false
      },
      {
        id: 6,
        title: 'Midterm Exam Review',
        courseId: 'CS101',
        courseName: 'Introduction to Computer Science',
        instructor: 'Dr. Sarah Johnson',
        description: 'Complete the online review quiz covering topics from weeks 1-8.',
        dueDate: '2025-10-12T23:59:00',
        submittedDate: '2025-10-11T20:15:00',
        status: 'graded',
        priority: 'high',
        points: 30,
        earnedPoints: 28,
        grade: 'A-',
        feedback: 'Good understanding of concepts. Review recursion for next exam.',
        attachments: [],
        submissionType: 'online',
        allowLateSubmission: false
      }
    ];

    setAssignments(mockAssignments);
    setFilteredAssignments(mockAssignments);
  }, []);

  // Filter assignments
  useEffect(() => {
    let filtered = assignments;

    if (filters.status !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === filters.status);
    }

    if (filters.course !== 'all') {
      filtered = filtered.filter(assignment => assignment.courseId === filters.course);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(assignment => assignment.priority === filters.priority);
    }

    setFilteredAssignments(filtered);
  }, [filters, assignments]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'graded': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days remaining`;
  };

  const handleFileUpload = async (assignmentId) => {
    if (!selectedFile) return;

    setUploadProgress(0);
    
    // Simulate file upload
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          // Update assignment status
          setAssignments(prevAssignments => 
            prevAssignments.map(assignment => 
              assignment.id === assignmentId 
                ? { ...assignment, status: 'submitted', submittedDate: new Date().toISOString() }
                : assignment
            )
          );
          setSelectedFile(null);
          alert('Assignment submitted successfully!');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const uniqueCourses = [...new Set(assignments.map(a => ({ id: a.courseId, name: a.courseName })))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="mt-2 text-gray-600">Track and submit your coursework</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Assignments</p>
                <p className="text-2xl font-semibold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {assignments.filter(a => a.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Submitted</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {assignments.filter(a => a.status === 'submitted').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Graded</p>
                <p className="text-2xl font-semibold text-green-600">
                  {assignments.filter(a => a.status === 'graded').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
            </div>

            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <select
                id="course"
                value={filters.course}
                onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course.id} value={course.id}>{course.id} - {course.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">
                        {assignment.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {assignment.courseId} - {assignment.courseName} • {assignment.instructor}
                    </p>
                    <p className="text-gray-700 mb-3">{assignment.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Due:</span> {formatDate(assignment.dueDate)}
                      </div>
                      <div>
                        <span className="font-medium">Points:</span> {assignment.points}
                        {assignment.earnedPoints && ` (${assignment.earnedPoints} earned)`}
                      </div>
                      <div className={`font-medium ${getPriorityColor(assignment.priority)}`}>
                        Priority: {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 text-right">
                    <div className={`text-sm font-medium ${
                      getTimeRemaining(assignment.dueDate) === 'Overdue' ? 'text-red-600' :
                      getTimeRemaining(assignment.dueDate) === 'Due today' ? 'text-orange-600' :
                      'text-gray-600'
                    }`}>
                      {getTimeRemaining(assignment.dueDate)}
                    </div>
                    {assignment.grade && (
                      <div className="mt-1 text-lg font-bold text-green-600">
                        {assignment.grade}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submission Section */}
                {assignment.status === 'pending' && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Submit Assignment</h4>
                    
                    {assignment.submissionType === 'file' && (
                      <div className="space-y-3">
                        <div>
                          <input
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                        
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleFileUpload(assignment.id)}
                          disabled={!selectedFile || (uploadProgress > 0 && uploadProgress < 100)}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            selectedFile && uploadProgress === 0
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Submit Assignment
                        </button>
                      </div>
                    )}

                    {assignment.submissionType === 'text' && (
                      <div className="space-y-3">
                        <textarea
                          rows={4}
                          placeholder="Enter your submission text here..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                          Submit Text
                        </button>
                      </div>
                    )}

                    {assignment.submissionType === 'online' && (
                      <div>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700">
                          Take Online Quiz
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Submission Info */}
                {(assignment.status === 'submitted' || assignment.status === 'graded') && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Submitted: {formatDate(assignment.submittedDate)}</span>
                      {assignment.attachments.length > 0 && (
                        <span>📎 {assignment.attachments.length} file(s) attached</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {assignment.feedback && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Instructor Feedback</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{assignment.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600">
              No assignments match your current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignmentsPage;