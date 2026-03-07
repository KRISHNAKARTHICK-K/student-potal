import React, { useState, useEffect } from 'react';

function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    // Mock resources data
    const mockResources = [
      {
        id: 1,
        title: 'Introduction to Programming - Lecture Notes',
        description: 'Comprehensive lecture notes covering basic programming concepts, variables, loops, and functions.',
        category: 'computer-science',
        type: 'pdf',
        course: 'CS101',
        instructor: 'Dr. Sarah Johnson',
        fileSize: '2.5 MB',
        downloadCount: 234,
        uploadDate: '2025-09-15',
        url: '#',
        tags: ['programming', 'basics', 'python', 'lecture-notes']
      },
      {
        id: 2,
        title: 'Calculus II Formula Sheet',
        description: 'Essential formulas and theorems for integration, series, and multivariable calculus.',
        category: 'mathematics',
        type: 'pdf',
        course: 'MATH201',
        instructor: 'Prof. Michael Chen',
        fileSize: '1.2 MB',
        downloadCount: 456,
        uploadDate: '2025-09-20',
        url: '#',
        tags: ['calculus', 'formulas', 'integration', 'series']
      },
      {
        id: 3,
        title: 'Physics Lab Manual',
        description: 'Complete laboratory manual with experiments, procedures, and safety guidelines.',
        category: 'physics',
        type: 'pdf',
        course: 'PHYS150',
        instructor: 'Dr. Lisa Anderson',
        fileSize: '8.7 MB',
        downloadCount: 178,
        uploadDate: '2025-08-30',
        url: '#',
        tags: ['physics', 'laboratory', 'experiments', 'manual']
      },
      {
        id: 4,
        title: 'Data Structures Video Lectures',
        description: 'Video series covering arrays, linked lists, stacks, queues, trees, and graphs with code examples.',
        category: 'computer-science',
        type: 'video',
        course: 'CS201',
        instructor: 'Dr. James Thompson',
        fileSize: '1.2 GB',
        downloadCount: 89,
        uploadDate: '2025-09-10',
        url: '#',
        tags: ['data-structures', 'algorithms', 'programming', 'videos']
      },
      {
        id: 5,
        title: 'English Grammar Reference Guide',
        description: 'Comprehensive guide to English grammar rules, punctuation, and writing style.',
        category: 'english',
        type: 'pdf',
        course: 'ENG102',
        instructor: 'Prof. David Wilson',
        fileSize: '3.1 MB',
        downloadCount: 312,
        uploadDate: '2025-09-05',
        url: '#',
        tags: ['grammar', 'writing', 'english', 'reference']
      },
      {
        id: 6,
        title: 'World War II Documentary',
        description: 'Educational documentary covering major events and impacts of World War II.',
        category: 'history',
        type: 'video',
        course: 'HIST101',
        instructor: 'Dr. Maria Rodriguez',
        fileSize: '2.8 GB',
        downloadCount: 67,
        uploadDate: '2025-09-12',
        url: '#',
        tags: ['world-war-ii', 'history', 'documentary', 'education']
      },
      {
        id: 7,
        title: 'Python Programming Examples',
        description: 'Collection of Python code examples and exercises for beginners.',
        category: 'computer-science',
        type: 'zip',
        course: 'CS101',
        instructor: 'Dr. Sarah Johnson',
        fileSize: '856 KB',
        downloadCount: 445,
        uploadDate: '2025-09-18',
        url: '#',
        tags: ['python', 'programming', 'examples', 'exercises']
      },
      {
        id: 8,
        title: 'Statistics Study Guide',
        description: 'Study guide with practice problems and solutions for statistical analysis.',
        category: 'mathematics',
        type: 'pdf',
        course: 'STAT201',
        instructor: 'Prof. Emily Davis',
        fileSize: '4.3 MB',
        downloadCount: 289,
        uploadDate: '2025-09-22',
        url: '#',
        tags: ['statistics', 'study-guide', 'practice-problems', 'analysis']
      },
      {
        id: 9,
        title: 'Chemistry Lab Safety Video',
        description: 'Important safety procedures and protocols for chemistry laboratory work.',
        category: 'chemistry',
        type: 'video',
        course: 'CHEM101',
        instructor: 'Dr. Robert Kim',
        fileSize: '156 MB',
        downloadCount: 234,
        uploadDate: '2025-08-25',
        url: '#',
        tags: ['chemistry', 'safety', 'laboratory', 'protocols']
      },
      {
        id: 10,
        title: 'Academic Writing Templates',
        description: 'Templates and formats for essays, research papers, and citations.',
        category: 'english',
        type: 'docx',
        course: 'ENG102',
        instructor: 'Prof. David Wilson',
        fileSize: '245 KB',
        downloadCount: 678,
        uploadDate: '2025-09-01',
        url: '#',
        tags: ['writing', 'templates', 'essays', 'research-papers']
      }
    ];

    setResources(mockResources);
    setFilteredResources(mockResources);
  }, []);

  // Filter resources based on search term, category, and type
  useEffect(() => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    setFilteredResources(filtered);
  }, [searchTerm, selectedCategory, selectedType, resources]);

  const getFileTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'video': return '🎥';
      case 'zip': return '📦';
      case 'docx': return '📝';
      case 'pptx': return '📊';
      case 'xlsx': return '📈';
      default: return '📋';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'computer-science': '💻',
      'mathematics': '📐',
      'physics': '🔬',
      'chemistry': '⚗️',
      'english': '📝',
      'history': '🏛️',
      'biology': '🧬'
    };
    return icons[category] || '📚';
  };

  const formatFileSize = (sizeStr) => {
    return sizeStr;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDownload = (resource) => {
    // Mock download functionality
    alert(`Downloading: ${resource.title}`);
    
    // Update download count
    setResources(prevResources => 
      prevResources.map(r => 
        r.id === resource.id 
          ? { ...r, downloadCount: r.downloadCount + 1 }
          : r
      )
    );
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' }
  ];

  const fileTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'pdf', label: 'PDF Documents' },
    { value: 'video', label: 'Video Files' },
    { value: 'zip', label: 'Archive Files' },
    { value: 'docx', label: 'Word Documents' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Study Resources</h1>
          <p className="mt-2 text-gray-600">Access course materials, documents, and educational content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Resources</p>
                <p className="text-2xl font-semibold text-blue-600">{resources.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">PDF Documents</p>
                <p className="text-2xl font-semibold text-green-600">
                  {resources.filter(r => r.type === 'pdf').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🎥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Video Content</p>
                <p className="text-2xl font-semibold text-purple-600">
                  {resources.filter(r => r.type === 'video').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⬇️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Downloads</p>
                <p className="text-2xl font-semibold text-orange-600">
                  {resources.reduce((total, resource) => total + resource.downloadCount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Resources
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, description, or tags..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
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
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                File Type
              </label>
              <select
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {fileTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredResources.length} of {resources.length} resources
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{getFileTypeIcon(resource.type)}</span>
                    <div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{getCategoryIcon(resource.category)}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {resource.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {resource.description}
                </p>

                {/* Course Info */}
                <div className="text-sm text-gray-500 mb-3">
                  <p><span className="font-medium">Course:</span> {resource.course}</p>
                  <p><span className="font-medium">Instructor:</span> {resource.instructor}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {resource.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{resource.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>📁 {formatFileSize(resource.fileSize)}</span>
                  <span>⬇️ {resource.downloadCount} downloads</span>
                  <span>📅 {formatDate(resource.uploadDate)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(resource)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Download
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">
              No resources match your current filters. Try adjusting your search criteria.
            </p>
          </div>
        )}

        {/* Upload Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">📤</span>
            <h3 className="text-lg font-semibold text-blue-900">Share Resources</h3>
          </div>
          <p className="text-blue-800 mb-4">
            Have useful study materials? Share them with your fellow students to help everyone succeed.
          </p>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
            Upload Resource
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResourcesPage;