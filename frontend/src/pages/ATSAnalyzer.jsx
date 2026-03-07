import React, { useState, useEffect } from "react";
import { listResumes, getResume, calculateATS } from "../services/resumeService";

function ATSAnalyzer() {
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const res = await listResumes();
      const list = res.data?.resumes || [];
      setResumes(list);
      if (list.length > 0 && !selectedId) {
        setSelectedId(list[0].id);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to load resumes" });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedId) {
      setMessage({ type: "error", text: "Please select a resume" });
      return;
    }
    if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length < 20) {
      setMessage({ type: "error", text: "Please paste a job description (at least 20 characters)" });
      return;
    }

    setAnalyzing(true);
    setMessage({ type: "", text: "" });
    setResult(null);

    try {
      const res = await calculateATS(selectedId, { jobDescription: jobDescription.trim() });
      const data = res.data;

      if (data.success === false) {
        setMessage({ type: "error", text: data.message || "Analysis failed" });
        return;
      }

      setResult({
        score: data.score ?? 0,
        breakdown: data.breakdown ?? {
          keywordScore: 0,
          skillScore: 0,
          experienceScore: 0,
          projectScore: 0,
          completenessScore: 0
        },
        missingKeywords: Array.isArray(data.missingKeywords) ? data.missingKeywords : [],
        suggestions: Array.isArray(data.suggestions) ? data.suggestions : []
      });
      setMessage({ type: "success", text: "Analysis complete" });
      loadResumes(); // Refresh to get updated ats_score
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to analyze resume";
      setMessage({ type: "error", text: msg });
      setResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score) => {
    if (score >= 70) return "bg-green-500/20";
    if (score >= 50) return "bg-yellow-500/20";
    return "bg-red-500/20";
  };

  const breakdownLabels = {
    keywordScore: "Keyword Match",
    skillScore: "Skill Match",
    experienceScore: "Experience Relevance",
    projectScore: "Projects Relevance",
    completenessScore: "Completeness"
  };

  const breakdownMax = {
    keywordScore: 30,
    skillScore: 25,
    experienceScore: 20,
    projectScore: 15,
    completenessScore: 10
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          ATS Analyzer
        </h1>
        <p className="text-slate-400">
          Paste a job description to see how well your resume matches. Get actionable suggestions to improve your ATS score.
        </p>
      </div>

      <div className="glass-card p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Select Resume</label>
            <select
              value={selectedId || ""}
              onChange={(e) => setSelectedId(e.target.value ? parseInt(e.target.value, 10) : null)}
              className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white"
            >
              <option value="">Choose a resume</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} {r.ats_score ? `(${r.ats_score}%)` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Job Description <span className="text-slate-500">(paste the full JD)</span>
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here. Include requirements, skills, and responsibilities for accurate matching..."
              className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              rows={8}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing || !selectedId || !jobDescription?.trim()}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {analyzing ? "Analyzing..." : "Analyze Resume"}
          </button>

          {message.text && (
            <p className={`text-sm ${message.type === "error" ? "text-red-400" : "text-green-400"}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>

      {result && (
        <>
          {/* Score Card */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">ATS Score</h2>
            <div className="flex items-center gap-6">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold ${getScoreBgColor(result.score)} ${getScoreColor(result.score)}`}
              >
                {result.score}%
              </div>
              <div className="flex-1">
                <p className="text-slate-400 mb-2">
                  {result.score >= 70
                    ? "Your resume is well-optimized for this role."
                    : result.score >= 50
                    ? "Good match. Consider adding more relevant keywords."
                    : "Your resume needs improvement to pass ATS screening."}
                </p>
                <div className="w-full bg-slate-700 rounded-full h-3 mt-2">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      result.score >= 70 ? "bg-green-500" : result.score >= 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, result.score)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Score Breakdown</h2>
            <div className="space-y-4">
              {result.breakdown &&
                Object.entries(result.breakdown).map(([key, value]) => {
                  const max = breakdownMax[key] ?? 100;
                  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{breakdownLabels[key] || key}</span>
                        <span className="text-white font-medium">
                          {value}/{max}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Missing Keywords */}
          {result.missingKeywords && result.missingKeywords.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 text-amber-400">Missing Keywords</h2>
              <p className="text-slate-400 text-sm mb-3">
                Consider adding these terms from the job description to improve your score:
              </p>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm border border-amber-500/30"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions && result.suggestions.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-400">Suggestions</h2>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {resumes.length === 0 && (
        <div className="glass-card p-6 text-center text-slate-400">
          No resumes found. Create a resume first in the Resume Builder.
        </div>
      )}
    </div>
  );
}

export default ATSAnalyzer;
