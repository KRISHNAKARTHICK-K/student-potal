import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

function XPDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/achievements/analytics');
      setAnalytics(res.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading dashboard...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="text-slate-400">No analytics data available</div>
      </div>
    );
  }

  const { xpByCategory, achievementsPerMonth, skillStrengths, xpSummary, badges } = analytics;

  // Calculate level progress percentage
  const levelProgress = xpSummary.next_level_xp > 0 
    ? (xpSummary.level_xp / xpSummary.next_level_xp) * 100 
    : 0;

  // Prepare chart data
  const pieData = xpByCategory.map(cat => ({
    name: cat.category,
    value: cat.total_xp,
    color: cat.color || '#3b82f6'
  }));

  const barData = achievementsPerMonth.map(month => ({
    month: new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    achievements: month.count,
    xp: month.total_xp
  }));

  const radarData = skillStrengths.map(skill => ({
    skill: skill.skill,
    achievements: skill.achievements || 0,
    xp: skill.total_xp || 0,
    fullMark: Math.max(...skillStrengths.map(s => Math.max(s.achievements || 0, s.total_xp || 0))) || 10
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6'];

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          XP Dashboard
        </h1>
        <p className="text-slate-400">Track your progress, achievements, and skill development</p>
      </div>

      {/* XP Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg">
              ⭐
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{xpSummary.total_xp || 0}</div>
          <div className="text-sm text-slate-400">Total XP</div>
        </div>

        <div className="glass-card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-2xl shadow-lg">
              🎯
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">Level {xpSummary.current_level || 1}</div>
          <div className="text-sm text-slate-400">Current Level</div>
        </div>

        <div className="glass-card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
              📊
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{xpSummary.level_xp || 0} / {xpSummary.next_level_xp || 100}</div>
          <div className="text-sm text-slate-400">Level Progress</div>
        </div>

        <div className="glass-card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
              🏅
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{badges?.length || 0}</div>
          <div className="text-sm text-slate-400">Badges Earned</div>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-400">Level {xpSummary.current_level || 1} Progress</span>
          <span className="text-sm font-bold text-white">{Math.round(levelProgress)}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 shadow-lg"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-slate-400">
          {xpSummary.next_level_xp - xpSummary.level_xp} XP needed for Level {(xpSummary.current_level || 1) + 1}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - XP by Category */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            XP Distribution by Category
          </h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              No data available
            </div>
          )}
        </div>

        {/* Bar Chart - Achievements per Month */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Achievements per Month
          </h2>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
                <Legend />
                <Bar dataKey="achievements" fill="#3b82f6" name="Achievements" />
                <Bar dataKey="xp" fill="#10b981" name="XP Earned" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Radar Chart - Skill Strengths */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Skill Strengths
        </h2>
        {radarData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="skill" stroke="#9ca3af" />
              <PolarRadiusAxis angle={90} domain={[0, 'auto']} stroke="#9ca3af" />
              <Radar
                name="Achievements"
                dataKey="achievements"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Radar
                name="XP"
                dataKey="xp"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-slate-400">
            No data available
          </div>
        )}
      </div>

      {/* Badges Section */}
      {badges && badges.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Earned Badges
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 text-center hover:border-blue-500/50 transition-all"
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-sm font-semibold text-white mb-1">{badge.name}</div>
                <div className="text-xs text-slate-400">{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default XPDashboardPage;
