import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function GradesPage() {
  const { user } = useAuth();
  const [gradesData, setGradesData] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [overallGPA, setOverallGPA] = useState(0);

  useEffect(() => {
    const studentId = user?.id || 1;

    fetch(`http://localhost:5000/api/student/grades/${studentId}`)
      .then(res => res.json())
      .then(data => {
        // Convert backend format to UI format
        const formatted = data.map((g, i) => ({
          courseId: i + 1,
          courseName: g.subject,
          instructor: '-',
          semester: g.semester || 'Current',
          credits: 3,
          assignments: [],
          currentGrade: g.gpa >= 9 ? 'A' :
                        g.gpa >= 8 ? 'B+' :
                        g.gpa >= 7 ? 'B' :
                        g.gpa >= 6 ? 'C' : 'D',
          gradePoints: g.gpa,
          percentage: g.marks,
          status: 'active'
        }));

        setGradesData(formatted);

        // GPA calculation
        if (formatted.length > 0) {
          const avg =
            formatted.reduce((sum, c) => sum + c.gradePoints, 0) /
            formatted.length;
          setOverallGPA(avg.toFixed(2));
        } else {
          setOverallGPA(0);
        }
      })
      .catch(console.error);
  }, [user]);

  const filteredGrades = gradesData;

  const getGradeBadge = grade => {
    if (grade.startsWith('A')) return 'from-green-500 to-emerald-500';
    if (grade.startsWith('B')) return 'from-blue-500 to-cyan-500';
    if (grade.startsWith('C')) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getPercentageColor = percentage => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 80) return 'text-blue-400';
    if (percentage >= 70) return 'text-yellow-400';
    if (percentage >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="fade-in space-y-6">

      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text">
          Academic Grades
        </h1>
        <p className="text-slate-400">
          Real grades from backend database
        </p>
      </div>

      {/* GPA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="glass-card-hover p-6">
          <p className="text-sm text-slate-400 mb-1">Current GPA</p>
          <p className={`text-2xl font-bold ${getPercentageColor(overallGPA*25)}`}>
            {overallGPA}
          </p>
        </div>

        <div className="glass-card-hover p-6">
          <p className="text-sm text-slate-400 mb-1">Courses</p>
          <p className="text-2xl font-bold text-blue-400">
            {filteredGrades.length}
          </p>
        </div>

        <div className="glass-card-hover p-6">
          <p className="text-sm text-slate-400 mb-1">Average %</p>
          <p className="text-2xl font-bold text-green-400">
            {filteredGrades.length > 0
              ? (
                  filteredGrades.reduce((s, c) => s + c.percentage, 0) /
                  filteredGrades.length
                ).toFixed(1)
              : 0}%
          </p>
        </div>

      </div>

      {/* Grades Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h3 className="text-lg font-bold text-white">
            Course Grades
          </h3>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-6 py-4 text-left text-xs text-slate-400">Course</th>
              <th className="px-6 py-4 text-center text-xs text-slate-400">Grade</th>
              <th className="px-6 py-4 text-center text-xs text-slate-400">%</th>
              <th className="px-6 py-4 text-center text-xs text-slate-400">GPA</th>
            </tr>
          </thead>

          <tbody>
            {filteredGrades.map(course => (
              <tr key={course.courseId} className="border-t border-slate-700">
                <td className="px-6 py-4 text-white">
                  {course.courseName}
                </td>

                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-lg bg-gradient-to-r ${getGradeBadge(course.currentGrade)} text-white`}>
                    {course.currentGrade}
                  </span>
                </td>

                <td className={`px-6 py-4 text-center font-semibold ${getPercentageColor(course.percentage)}`}>
                  {course.percentage}%
                </td>

                <td className="px-6 py-4 text-center text-white">
                  {course.gradePoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default GradesPage;
