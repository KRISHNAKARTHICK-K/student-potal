import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AchievementUploadPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    certificate_url: '',
    date_achieved: new Date().toISOString().split('T')[0]
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await api.get('/achievements/categories');
      const categoriesList = res.data.categories || [];
      setCategories(categoriesList);

      if (categoriesList.length === 0) {
        setMessage({
          type: 'error',
          text: 'No categories available. Please contact administrator.'
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load categories. Please refresh the page.'
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFormData(prev => ({
        ...prev,
        certificate_url: URL.createObjectURL(selectedFile)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        certificate_file_path: file ? file.name : null
      };

      const res = await api.post('/achievements', payload);

      if (res.data.success) {
        setMessage({
          type: 'success',
          text: 'Achievement submitted successfully! Awaiting admin approval.'
        });

        setFormData({
          title: '',
          description: '',
          category_id: '',
          certificate_url: '',
          date_achieved: new Date().toISOString().split('T')[0]
        });

        setFile(null);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to submit achievement'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h1
          className="text-3xl font-bold mb-2 gradient-text"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Submit Achievement
        </h1>
        <p className="text-slate-400">
          Share your accomplishments and earn XP!
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`glass-card p-4 border ${
            message.type === 'success'
              ? 'border-green-500/50 bg-green-500/10 text-green-400'
              : 'border-red-500/50 bg-red-500/10 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Achievement Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="e.g., Won First Place in Hackathon"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Category *
            </label>

            {categoriesLoading ? (
              <div className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                <span>Loading categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="w-full px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
                ⚠️ No categories available. Please contact administrator.
              </div>
            ) : (
              <>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon || '🏆'} {cat.name}
                    </option>
                  ))}
                </select>

                <p className="mt-1 text-xs text-slate-500">
                  {categories.length} categories available
                </p>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200"
              placeholder="Describe your achievement..."
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Date Achieved
            </label>
            <input
              type="date"
              name="date_achieved"
              value={formData.date_achieved}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200"
            />
          </div>

          {/* Certificate URL */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Certificate URL
            </label>
            <input
              type="url"
              name="certificate_url"
              value={formData.certificate_url}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200"
              placeholder="https://example.com/certificate.pdf"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Upload Certificate File
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200"
            />
            {file && (
              <p className="mt-2 text-sm text-slate-400">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Achievement'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AchievementUploadPage;