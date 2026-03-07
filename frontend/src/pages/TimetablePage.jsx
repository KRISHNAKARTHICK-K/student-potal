import React, { useState, useEffect } from 'react';

function TimetablePage() {
  const [timetableData, setTimetableData] = useState({});
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [selectedView, setSelectedView] = useState('week'); // 'week' or 'day'
  const [selectedDay, setSelectedDay] = useState(new Date().getDay()); // 0 = Sunday

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  useEffect(() => {
    // Mock timetable data
    const mockTimetable = {
      Monday: [
        {
          id: 1,
          courseId: 'CS101',
          courseName: 'Introduction to Computer Science',
          instructor: 'Dr. Sarah Johnson',
          room: 'Science Building - Room 201',
          startTime: '10:00',
          endTime: '11:00',
          type: 'lecture',
          color: 'blue'
        },
        {
          id: 2,
          courseId: 'ENG102',
          courseName: 'English Composition',
          instructor: 'Prof. David Wilson',
          room: 'Humanities Building - Room 203',
          startTime: '11:00',
          endTime: '12:00',
          type: 'lecture',
          color: 'green'
        },
        {
          id: 3,
          courseId: 'PHYS150',
          courseName: 'General Physics I',
          instructor: 'Dr. Lisa Anderson',
          room: 'Physics Lab - Room 101',
          startTime: '13:00',
          endTime: '14:30',
          type: 'lab',
          color: 'purple'
        }
      ],
      Tuesday: [
        {
          id: 4,
          courseId: 'MATH201',
          courseName: 'Calculus II',
          instructor: 'Prof. Michael Chen',
          room: 'Math Building - Room 305',
          startTime: '14:00',
          endTime: '15:30',
          type: 'lecture',
          color: 'red'
        },
        {
          id: 5,
          courseId: 'HIST101',
          courseName: 'World History',
          instructor: 'Dr. Maria Rodriguez',
          room: 'Liberal Arts - Room 150',
          startTime: '10:00',
          endTime: '11:30',
          type: 'lecture',
          color: 'yellow'
        }
      ],
      Wednesday: [
        {
          id: 6,
          courseId: 'CS101',
          courseName: 'Introduction to Computer Science',
          instructor: 'Dr. Sarah Johnson',
          room: 'Science Building - Room 201',
          startTime: '10:00',
          endTime: '11:00',
          type: 'lecture',
          color: 'blue'
        },
        {
          id: 7,
          courseId: 'ENG102',
          courseName: 'English Composition',
          instructor: 'Prof. David Wilson',
          room: 'Humanities Building - Room 203',
          startTime: '11:00',
          endTime: '12:00',
          type: 'lecture',
          color: 'green'
        },
        {
          id: 8,
          courseId: 'PHYS150',
          courseName: 'General Physics I',
          instructor: 'Dr. Lisa Anderson',
          room: 'Physics Lab - Room 101',
          startTime: '13:00',
          endTime: '14:30',
          type: 'lab',
          color: 'purple'
        }
      ],
      Thursday: [
        {
          id: 9,
          courseId: 'MATH201',
          courseName: 'Calculus II',
          instructor: 'Prof. Michael Chen',
          room: 'Math Building - Room 305',
          startTime: '14:00',
          endTime: '15:30',
          type: 'lecture',
          color: 'red'
        },
        {
          id: 10,
          courseId: 'HIST101',
          courseName: 'World History',
          instructor: 'Dr. Maria Rodriguez',
          room: 'Liberal Arts - Room 150',
          startTime: '10:00',
          endTime: '11:30',
          type: 'lecture',
          color: 'yellow'
        }
      ],
      Friday: [
        {
          id: 11,
          courseId: 'CS101',
          courseName: 'Introduction to Computer Science',
          instructor: 'Dr. Sarah Johnson',
          room: 'Science Building - Room 201',
          startTime: '10:00',
          endTime: '11:00',
          type: 'lecture',
          color: 'blue'
        },
        {
          id: 12,
          courseId: 'ENG102',
          courseName: 'English Composition',
          instructor: 'Prof. David Wilson',
          room: 'Humanities Building - Room 203',
          startTime: '11:00',
          endTime: '12:00',
          type: 'lecture',
          color: 'green'
        }
      ],
      Saturday: [],
      Sunday: []
    };

    setTimetableData(mockTimetable);
  }, []);

  const getColorClasses = (color, type = 'background') => {
    const colorMap = {
      blue: type === 'background' ? 'bg-blue-100 border-blue-300' : 'text-blue-800',
      green: type === 'background' ? 'bg-green-100 border-green-300' : 'text-green-800',
      purple: type === 'background' ? 'bg-purple-100 border-purple-300' : 'text-purple-800',
      red: type === 'background' ? 'bg-red-100 border-red-300' : 'text-red-800',
      yellow: type === 'background' ? 'bg-yellow-100 border-yellow-300' : 'text-yellow-800'
    };
    return colorMap[color] || 'bg-gray-100 border-gray-300';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'lecture': return '👨‍🏫';
      case 'lab': return '🔬';
      case 'tutorial': return '📚';
      case 'exam': return '📝';
      default: return '📅';
    }
  };

  const isTimeInRange = (time, startTime, endTime) => {
    return time >= startTime && time < endTime;
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDates = getCurrentWeekDates();

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isToday = (dayIndex) => {
    return dayIndex === new Date().getDay();
  };

  const getUpcomingClasses = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDay = daysOfWeek[now.getDay()];
    
    let upcoming = [];
    
    // Get remaining classes for today
    const todayClasses = timetableData[currentDay] || [];
    const remainingToday = todayClasses.filter(cls => cls.startTime > currentTime);
    
    upcoming = [...remainingToday];
    
    // Get classes for next few days if needed
    if (upcoming.length < 3) {
      const nextDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const currentDayIndex = nextDays.indexOf(currentDay);
      
      for (let i = 1; i < 7 && upcoming.length < 3; i++) {
        const nextDayIndex = (currentDayIndex + i) % 7;
        const nextDay = nextDays[nextDayIndex];
        const nextDayClasses = timetableData[nextDay] || [];
        upcoming = [...upcoming, ...nextDayClasses];
      }
    }
    
    return upcoming.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Class Timetable</h1>
          <p className="mt-2 text-gray-600">View your weekly class schedule</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="current">Current Week</option>
                <option value="next">Next Week</option>
              </select>

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedView('week')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    selectedView === 'week' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Week View
                </button>
                <button
                  onClick={() => setSelectedView('day')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    selectedView === 'day' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Day View
                </button>
              </div>
            </div>

            {selectedView === 'day' && (
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {daysOfWeek.map((day, index) => (
                  <option key={index} value={index}>{day}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Upcoming Classes Quick View */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getUpcomingClasses().map((cls, index) => (
              <div key={cls.id} className={`p-4 rounded-lg border-2 ${getColorClasses(cls.color)}`}>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">{getTypeIcon(cls.type)}</span>
                  <h3 className={`font-semibold ${getColorClasses(cls.color, 'text')}`}>
                    {cls.courseId}
                  </h3>
                </div>
                <p className="text-sm text-gray-700 mb-1">{cls.courseName}</p>
                <p className="text-sm text-gray-600 mb-1">📍 {cls.room}</p>
                <p className="text-sm text-gray-600">⏰ {cls.startTime} - {cls.endTime}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timetable */}
        {selectedView === 'week' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Weekly Schedule</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Time
                    </th>
                    {daysOfWeek.slice(1, 6).map((day, index) => (
                      <th key={day} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className={`${isToday(index + 1) ? 'text-blue-600 font-bold' : ''}`}>
                          {day}
                          <br />
                          <span className="text-xs font-normal">
                            {formatDate(weekDates[index + 1])}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeSlots.map((timeSlot, timeIndex) => (
                    <tr key={timeSlot}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        {timeSlot}
                      </td>
                      {daysOfWeek.slice(1, 6).map((day) => {
                        const dayClasses = timetableData[day] || [];
                        const classInSlot = dayClasses.find(cls => 
                          isTimeInRange(timeSlot, cls.startTime, cls.endTime)
                        );
                        
                        return (
                          <td key={day} className="px-2 py-2 text-center relative">
                            {classInSlot && (
                              <div className={`p-2 rounded-lg border-2 text-xs ${getColorClasses(classInSlot.color)}`}>
                                <div className="flex items-center justify-center mb-1">
                                  <span className="mr-1">{getTypeIcon(classInSlot.type)}</span>
                                  <span className={`font-semibold ${getColorClasses(classInSlot.color, 'text')}`}>
                                    {classInSlot.courseId}
                                  </span>
                                </div>
                                <div className="text-gray-700 mb-1">{classInSlot.courseName}</div>
                                <div className="text-gray-600">📍 {classInSlot.room}</div>
                                <div className="text-gray-600">⏰ {classInSlot.startTime}-{classInSlot.endTime}</div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {daysOfWeek[selectedDay]} Schedule
                <span className="ml-2 text-sm text-gray-500">
                  {formatDate(weekDates[selectedDay])}
                </span>
              </h2>
            </div>
            
            <div className="p-6">
              {(timetableData[daysOfWeek[selectedDay]] || []).length > 0 ? (
                <div className="space-y-4">
                  {(timetableData[daysOfWeek[selectedDay]] || []).map((cls) => (
                    <div key={cls.id} className={`p-4 rounded-lg border-2 ${getColorClasses(cls.color)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">{getTypeIcon(cls.type)}</span>
                            <div>
                              <h3 className={`text-lg font-semibold ${getColorClasses(cls.color, 'text')}`}>
                                {cls.courseId} - {cls.courseName}
                              </h3>
                              <p className="text-sm text-gray-600">{cls.instructor}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>📍 {cls.room}</div>
                            <div>⏰ {cls.startTime} - {cls.endTime}</div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getColorClasses(cls.color)}`}>
                          {cls.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No classes scheduled</h3>
                  <p className="text-gray-600">
                    You have no classes scheduled for {daysOfWeek[selectedDay].toLowerCase()}.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Class Types</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="text-lg mr-2">👨‍🏫</span>
              <span className="text-sm text-gray-700">Lecture</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg mr-2">🔬</span>
              <span className="text-sm text-gray-700">Laboratory</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg mr-2">📚</span>
              <span className="text-sm text-gray-700">Tutorial</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg mr-2">📝</span>
              <span className="text-sm text-gray-700">Examination</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimetablePage;
