import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/student/courses",
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (!data.success) {
          console.error(data.message);
          return;
        }

        const formatted = data.courses.map((c) => ({
          id: c.id,
          code: c.code,
          name: c.name,
          instructor: c.teacher_name || '—',
          credits: 3,
          semester: c.semester || 'Current',
          status: 'active',
          progress: 70,
          grade: 'B+',
          gradient: 'from-blue-500 to-purple-500'
        }));

        setCourses(formatted);
        setFilteredCourses(formatted);

      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);

  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm]);

  const getProgressColor = p =>
    p >= 80 ? 'from-green-500 to-emerald-500'
    : p >= 60 ? 'from-yellow-500 to-orange-500'
    : 'from-red-500 to-pink-500';

  const getGradeColor = g =>
    g.startsWith('A') ? 'from-green-500 to-emerald-500'
    : g.startsWith('B') ? 'from-blue-500 to-cyan-500'
    : 'from-red-500 to-pink-500';

  const CourseCard = ({ course }) => (
    <div className="glass-card-hover p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`px-3 py-1 text-xs font-bold rounded-lg bg-gradient-to-r ${course.gradient} text-white`}>
            {course.code}
          </span>
          <h3 className="text-lg font-bold text-white mt-2">
            {course.name}
          </h3>
        </div>

        <div className={`w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br ${getGradeColor(course.grade)} text-white font-bold`}>
          {course.grade}
        </div>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-2">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(course.progress)}`}
          style={{ width: `${course.progress}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="fade-in space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold gradient-text">
          My Courses
        </h1>
        <p className="text-slate-400">
          Real courses from database
        </p>
      </div>

      <div className="glass-card p-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700 text-white"
        />
      </div>

      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(c => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map(c => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}

      {filteredCourses.length === 0 && (
        <div className="glass-card p-12 text-center text-slate-400">
          No courses found
        </div>
      )}
    </div>
  );
}

export default CoursesPage;