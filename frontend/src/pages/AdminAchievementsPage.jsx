import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminAchievementsPage() {
  const [pendingAchievements, setPendingAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [xpValue, setXpValue] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingAchievements();
  }, []);

  const fetchPendingAchievements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/achievements/pending');
      setPendingAchievements(res.data.achievements || []);
    } catch (error) {
      console.error('Error fetching pending achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, action) => {
    try {
      const payload = {
        action,
        xp: action === 'approve' ? parseInt(xpValue) : undefined,
        rejection_reason: action === 'reject' ? rejectionReason : undefined
      };

      await api.put(`/achievements/verify/${id}`, payload);
      
      // Refresh list
      await fetchPendingAchievements();
      
      // Reset form
      setEditingId(null);
      setXpValue('');
      setRejectionReason('');
    } catch (error) {
      console.error('Error verifying achievement:', error);
      alert(error.response?.data?.message || 'Failed to verify achievement');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading pending achievements...</div>
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
              Achievement Verification
            </h1>
            <p className="text-slate-400">Review and verify student achievements</p>
          </div>
          <div className="text-2xl font-bold text-white">
            {pendingAchievements.length} Pending
          </div>
        </div>
      </div>

      {/* Pending Achievements List */}
      {pendingAchievements.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-white mb-2">All caught up!</h3>
          <p className="text-slate-400">No pending achievements to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingAchievements.map((achievement) => (
            <div key={achievement.id} className="glass-card p-6">
              <div className="flex items-start justify-between gap-6">
                {/* Achievement Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{achievement.category_icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-slate-400">
                        by {achievement.student_name} ({achievement.student_email})
                      </p>
                    </div>
                  </div>

                  {achievement.description && (
                    <p className="text-slate-300 mb-4">{achievement.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>Category: {achievement.category_name}</span>
                    <span>•</span>
                    <span>Submitted: {new Date(achievement.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Certificate Preview */}
                  {achievement.certificate_url && (
                    <div className="mt-4">
                      <a
                        href={achievement.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2"
                      >
                        <span>📄</span>
                        <span>View Certificate</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Panel */}
                {editingId === achievement.id ? (
                  <div className="flex flex-col gap-3 min-w-[300px]">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        XP Amount *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={xpValue}
                        onChange={(e) => setXpValue(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Enter XP (e.g., 50)"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerify(achievement.id, 'approve')}
                        disabled={!xpValue || parseInt(xpValue) <= 0}
                        className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <button
                      onClick={() => {
                        setEditingId(achievement.id);
                        setXpValue('');
                      }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Enter rejection reason (optional):');
                        if (reason !== null) {
                          setRejectionReason(reason);
                          handleVerify(achievement.id, 'reject');
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-red-500/30 transition-all"
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminAchievementsPage;
