import React, { useState, useEffect } from 'react';

function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Mock announcements data
    const mockAnnouncements = [
      {
        id: 1,
        title: "New AI Chat Feature Available",
        content: "We're excited to announce the launch of our new AI-powered academic assistant! This intelligent chatbot can help you with course-related questions, study tips, assignment guidance, and much more. Simply navigate to the AI Chat section to start your conversation.",
        date: "2025-10-09",
        time: "14:30",
        author: "Admin Team",
        priority: "high",
        category: "feature",
        tags: ["AI", "New Feature", "Academic Support"]
      },
      {
        id: 2,
        title: "Midterm Examination Schedule Released",
        content: "The midterm examination schedule has been published. Examinations will be conducted from October 15-22, 2025. Please check your individual timetables for specific dates and venues. Students are advised to prepare accordingly and contact faculty for any clarifications.",
        date: "2025-10-08",
        time: "09:15",
        author: "Academic Office",
        priority: "high",
        category: "academic",
        tags: ["Exams", "Schedule", "Important"]
      },
      {
        id: 3,
        title: "Library Hours Extended During Exam Period",
        content: "To support students during the upcoming examination period, the university library will extend its operating hours. The library will remain open 24/7 from October 10-25. Additional study spaces and computer labs will also be available.",
        date: "2025-10-07",
        time: "11:45",
        author: "Library Services",
        priority: "medium",
        category: "facility",
        tags: ["Library", "Extended Hours", "Study"]
      },
      {
        id: 4,
        title: "Career Fair 2025 Registration Open",
        content: "Registration is now open for Career Fair 2025, scheduled for October 15. Over 50 companies will be participating, offering internship and job opportunities. Students can register through the career services portal. Professional attire is required.",
        date: "2025-10-06",
        time: "16:20",
        author: "Career Services",
        priority: "medium",
        category: "event",
        tags: ["Career Fair", "Jobs", "Registration"]
      },
      {
        id: 5,
        title: "System Maintenance Notice",
        content: "The student portal will undergo scheduled maintenance on October 12, 2025, from 2:00 AM to 6:00 AM. During this time, the system may be temporarily unavailable. We apologize for any inconvenience caused.",
        date: "2025-10-05",
        time: "13:10",
        author: "IT Department",
        priority: "low",
        category: "technical",
        tags: ["Maintenance", "System", "Downtime"]
      },
      {
        id: 6,
        title: "Guest Lecture: Future of Artificial Intelligence",
        content: "Join us for an exciting guest lecture by Dr. Jane Smith, AI researcher from Tech University, on 'The Future of Artificial Intelligence in Education.' The lecture will be held on October 18 at 2:00 PM in Auditorium A. All students are welcome.",
        date: "2025-10-04",
        time: "10:30",
        author: "Computer Science Dept",
        priority: "medium",
        category: "event",
        tags: ["Guest Lecture", "AI", "Education"]
      }
    ];

    setAnnouncements(mockAnnouncements);
    setFilteredAnnouncements(mockAnnouncements);
  }, []);

  // Filter announcements based on search term, priority, and category
  useEffect(() => {
    let filtered = announcements;

    if (searchTerm) {
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(announcement => announcement.priority === selectedPriority);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(announcement => announcement.category === selectedCategory);
    }

    setFilteredAnnouncements(filtered);
  }, [searchTerm, selectedPriority, selectedCategory, announcements]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'academic': return '📚';
      case 'event': return '🎉';
      case 'technical': return '🔧';
      case 'facility': return '🏢';
      case 'feature': return '✨';
      default: return '📢';
    }
  };

  const formatDate = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="mt-2 text-gray-600">Stay updated with the latest news and updates</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Announcements
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, content, or tags..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Priority Filter */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic</option>
                <option value="event">Events</option>
                <option value="technical">Technical</option>
                <option value="facility">Facility</option>
                <option value="feature">Features</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAnnouncements.length} of {announcements.length} announcements
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                
                {/* Announcement Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">{getCategoryIcon(announcement.category)}</span>
                        <h2 className="text-xl font-semibold text-gray-900">{announcement.title}</h2>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>📅 {formatDate(announcement.date, announcement.time)}</span>
                        <span>👤 {announcement.author}</span>
                      </div>
                    </div>
                    
                    {/* Priority Badge */}
                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                      <span className="mr-1">{getPriorityIcon(announcement.priority)}</span>
                      {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {announcement.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {announcement.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Posted {new Date(announcement.date).toLocaleDateString()}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">📢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
              <p className="text-gray-600">
                No announcements match your current filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementsPage;