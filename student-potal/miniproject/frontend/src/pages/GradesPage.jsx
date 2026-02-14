import React, { useState, useEffect } from 'react';

function GradesPage() {
  const [gradesData, setGradesData] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [gpaHistory, setGpaHistory] = useState([]);
  const [overallGPA, setOverallGPA] = useState(0);

  useEffect(() => {
    // Mock grades data
    const mockGradesData = [
      {
        courseId: 'CS101',
        courseName: 'Introduction to Computer Science',
        instructor: 'Dr. Sarah Johnson',
        semester: 'Fall 2025',
        credits: 3,
        assignments: [
          { name: 'Quiz 1', score: 95, total: 100, weight: 10, type: 'quiz' },
          { name: 'Assignment 1', score: 88, total: 100, weight: 15, type: 'assignment' },
          { name: 'Midterm Exam', score: 185, total: 200, weight: 25, type: 'exam' },
          { name: 'Final Project', score: 275, total: 300, weight: 35, type: 'project' },
          { name: 'Participation', score: 48, total: 50, weight: 15, type: 'participation' }
        ],
        currentGrade: 'A-',
        gradePoints: 3.7,
        percentage: 92.4,
        status: 'active'
      },
      {
        courseId: 'MATH201',
        courseName: 'Calculus II',
        instructor: 'Prof. Michael Chen',
        semester: 'Fall 2025',
        credits: 4,
        assignments: [
          { name: 'Homework Sets', score: 340, total: 400, weight: 30, type: 'homework' },
          { name: 'Quizzes', score: 145, total: 150, weight: 20, type: 'quiz' },
          { name: 'Midterm 1', score: 82, total: 100, weight: 20, type: 'exam' },
          { name: 'Midterm 2', score: 78, total: 100, weight: 20, type: 'exam' },
          { name: 'Final Exam', score: 85, total: 100, weight: 10, type: 'exam' }
        ],
        currentGrade: 'B+',
        gradePoints: 3.3,
        percentage: 87.2,
        status: 'active'
      },
      {
        courseId: 'PHYS150',
        courseName: 'General Physics I',
        instructor: 'Dr. Lisa Anderson',
        semester: 'Fall 2025',
        credits: 4,
        assignments: [
          { name: 'Lab Reports', score: 420, total: 500, weight: 25, type: 'lab' },
          { name: 'Problem Sets', score: 285, total: 300, weight: 25, type: 'homework' },
          { name: 'Midterm Exam', score: 75, total: 100, weight: 25, type: 'exam' },
          { name: 'Final Exam', score: 80, total: 100, weight: 25, type: 'exam' }
        ],
        currentGrade: 'B',
        gradePoints: 3.0,
        percentage: 84.0,
        status: 'active'
      },
      {
        courseId: 'ENG102',
        courseName: 'English Composition',
        instructor: 'Prof. David Wilson',
        semester: 'Fall 2025',
        credits: 3,
        assignments: [
          { name: 'Essays', score: 380, total: 400, weight: 40, type: 'essay' },
          { name: 'Discussion Posts', score: 95, total: 100, weight: 20, type: 'discussion' },
          { name: 'Peer Reviews', score: 48, total: 50, weight: 10, type: 'review' },
          { name: 'Final Portfolio', score: 285, total: 300, weight: 30, type: 'portfolio' }
        ],
        currentGrade: 'A',
        gradePoints: 4.0,
        percentage: 95.2,
        status: 'active'
      },
      {
        courseId: 'HIST101',
        courseName: 'World History',
        instructor: 'Dr. Maria Rodriguez',
        semester: 'Fall 2025',
        credits: 3,
        assignments: [
          { name: 'Research Paper', score: 175, total: 200, weight: 30, type: 'paper' },
          { name: 'Midterm Exam', score: 85, total: 100, weight: 25, type: 'exam' },
          { name: 'Final Exam', score: 82, total: 100, weight: 25, type: 'exam' },
          { name: 'Class Participation', score: 90, total: 100, weight: 20, type: 'participation' }
        ],
        currentGrade: 'B+',
        gradePoints: 3.3,
        percentage: 88.1,
        status: 'active'
      }
    ];

    // Mock GPA history
    const mockGpaHistory = [
      { semester: 'Spring 2024', gpa: 3.2, credits: 15 },
      { semester: 'Fall 2024', gpa: 3.5, credits: 16 },
      { semester: 'Spring 2025', gpa: 3.6, credits: 15 },
      { semester: 'Fall 2025', gpa: 3.5, credits: 17 }
    ];

    setGradesData(mockGradesData);
    setGpaHistory(mockGpaHistory);

    // Calculate overall GPA
    const totalCredits = mockGradesData.reduce((sum, course) => sum + course.credits, 0);
    const totalGradePoints = mockGradesData.reduce((sum, course) => sum + (course.gradePoints * course.credits), 0);
    setOverallGPA(totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0);
  }, []);

  // Filter grades by semester
  const filteredGrades = gradesData.filter(course => {
    if (selectedSemester === 'all') return true;
    if (selectedSemester === 'current') return course.status === 'active';
    return course.semester.toLowerCase().includes(selectedSemester.toLowerCase());
  });

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getAssignmentTypeIcon = (type) => {
    const icons = {
      'quiz': '🧪',
      'assignment': '📝',
      'exam': '📋',
      'project': '💻',
      'participation': '🙋',
      'homework': '📚',
      'lab': '🔬',
      'essay': '✍️',
      'discussion': '💬',
      'review': '👀',
      'portfolio': '📁',
      'paper': '📄'
    };
    return icons[type] || '📌';
  };

  const calculateCoursePercentage = (assignments) => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    assignments.forEach(assignment => {
      const percentage = (assignment.score / assignment.total) * 100;
      totalWeightedScore += (percentage * assignment.weight);
      totalWeight += assignment.weight;
    });

    return totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(1) : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Academic Grades</h1>
          <p className="mt-2 text-gray-600">Track your academic performance and GPA</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* GPA Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Current GPA</p>
                <p className={`text-2xl font-semibold ${getPercentageColor(parseFloat(overallGPA) * 25)}`}>
                  {overallGPA}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Credits</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {gradesData.reduce((sum, course) => sum + course.credits, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Courses</p>
                <p className="text-2xl font-semibold text-green-600">{filteredGrades.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average</p>
                <p className="text-2xl font-semibold text-purple-600">
                  {filteredGrades.length > 0 
                    ? (filteredGrades.reduce((sum, course) => sum + course.percentage, 0) / filteredGrades.length).toFixed(1) 
                    : '0'}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Semester Filter */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Grade Summary</h2>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="current">Current Semester</option>
              <option value="all">All Semesters</option>
              <option value="fall">Fall 2025</option>
              <option value="spring">Spring 2025</option>
            </select>
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Course Grades</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPA Points
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrades.map((course) => (
                  <tr key={course.courseId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                        <div className="text-sm text-gray-500">{course.courseId} • {course.instructor}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-900">{course.credits}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(course.currentGrade)}`}>
                        {course.currentGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-semibold ${getPercentageColor(course.percentage)}`}>
                        {course.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-900">{course.gradePoints}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Course Breakdown */}
        <div className="space-y-6">
          {filteredGrades.map((course) => (
            <div key={course.courseId} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {course.courseName} - Grade Breakdown
                  </h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(course.currentGrade)}`}>
                    {course.currentGrade} ({course.percentage}%)
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {course.assignments.map((assignment, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getAssignmentTypeIcon(assignment.type)}</span>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{assignment.name}</h4>
                            <p className="text-xs text-gray-500 capitalize">{assignment.type} • {assignment.weight}% weight</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Score:</span>
                          <span className={`text-sm font-semibold ${getPercentageColor((assignment.score / assignment.total) * 100)}`}>
                            {assignment.score}/{assignment.total}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Percentage:</span>
                          <span className={`text-sm font-semibold ${getPercentageColor((assignment.score / assignment.total) * 100)}`}>
                            {((assignment.score / assignment.total) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(assignment.score / assignment.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GPA History */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">GPA History</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gpaHistory.map((record, index) => (
                <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{record.semester}</div>
                  <div className={`text-2xl font-bold ${getPercentageColor(record.gpa * 25)}`}>
                    {record.gpa}
                  </div>
                  <div className="text-sm text-gray-500">{record.credits} Credits</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradesPage;