import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

function AchievementsPage() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/achievements/mine');
      setAchievements(res.data.achievements || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Pending', className: 'from-yellow-500 to-orange-500', icon: '⏳' },
      approved: { label: 'Approved', className: 'from-green-500 to-emerald-500', icon: '✅' },
      rejected: { label: 'Rejected', className: 'from-red-500 to-pink-500', icon: '❌' }
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading achievements...</div>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              My Achievements
            </h1>
            <p className="text-slate-400">View all your submitted achievements and certificates</p>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      {achievements.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-lg font-medium text-white mb-2">No achievements yet</h3>
          <p className="text-slate-400">Submit your first achievement to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            const statusBadge = getStatusBadge(achievement.status);
            return (
              <div
                key={achievement.id}
                className="glass-card-hover p-6 cursor-pointer group"
                onClick={() => setSelectedAchievement(achievement)}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-lg bg-gradient-to-r ${statusBadge.className} text-white text-xs font-semibold flex items-center gap-1`}>
                    <span>{statusBadge.icon}</span>
                    {statusBadge.label}
                  </span>
                  {achievement.xp > 0 && (
                    <span className="text-lg font-bold text-blue-400">+{achievement.xp} XP</span>
                  )}
                </div>

                {/* Category */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{achievement.category_icon}</span>
                  <span className="text-sm text-slate-400">{achievement.category_name}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {achievement.title}
                </h3>

                {/* Description */}
                {achievement.description && (
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {achievement.description}
                  </p>
                )}

                {/* Certificate Preview */}
                {achievement.certificate_url && (
                  <div className="mt-4 p-2 rounded-lg bg-slate-800/30 border border-slate-700/50">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>📄</span>
                      <span>Certificate attached</span>
                    </div>
                  </div>
                )}

                {/* Date */}
                <div className="mt-4 text-xs text-slate-500">
                  {new Date(achievement.created_at).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedAchievement && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            className="glass-card p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedAchievement.title}</h2>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Category</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl">{selectedAchievement.category_icon}</span>
                  <span className="text-white">{selectedAchievement.category_name}</span>
                </div>
              </div>

              {selectedAchievement.description && (
                <div>
                  <label className="text-sm text-slate-400">Description</label>
                  <p className="text-white mt-1">{selectedAchievement.description}</p>
                </div>
              )}

              {selectedAchievement.certificate_url && (
                <div>
                  <label className="text-sm text-slate-400">Certificate</label>
                  <div className="mt-2">
                    <img
                      src={selectedAchievement.certificate_url}
                      alt="Certificate"
                      className="w-full rounded-lg border border-slate-700/50"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none' }} className="p-4 bg-slate-800/50 rounded-lg text-center">
                      <a
                        href={selectedAchievement.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View Certificate
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {selectedAchievement.xp > 0 && (
                <div>
                  <label className="text-sm text-slate-400">XP Awarded</label>
                  <p className="text-2xl font-bold text-blue-400 mt-1">+{selectedAchievement.xp} XP</p>
                </div>
              )}

              {selectedAchievement.rejection_reason && (
                <div>
                  <label className="text-sm text-red-400">Rejection Reason</label>
                  <p className="text-red-300 mt-1">{selectedAchievement.rejection_reason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AchievementsPage;
