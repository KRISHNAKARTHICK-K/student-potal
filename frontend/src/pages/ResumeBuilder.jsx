import React, { useState, useEffect } from "react";
import {
  createResume,
  listResumes,
  getResume,
  updateResume,
  deleteResume,
  downloadResumePdf
} from "../services/resumeService";

const emptySkill = { skill: "", skill_type: "technical" };
const emptyExperience = { company: "", role: "", description: "", start_date: "", end_date: "" };
const emptyProject = { title: "", description: "", technologies: "", github_link: "", live_link: "" };
const emptyEducation = { institution: "", degree: "", field: "", start_year: "", end_year: "", cgpa: "" };

function ResumeBuilder({ onNavigate }) {
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    title: "",
    summary: "",
    template: "modern",
    skills: [{ ...emptySkill }],
    experience: [{ ...emptyExperience }],
    projects: [{ ...emptyProject }],
    education: [{ ...emptyEducation }]
  });

  useEffect(() => {
    loadResumes();
  }, []);

  useEffect(() => {
    if (selectedId) loadResume(selectedId);
  }, [selectedId]);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const res = await listResumes();
      setResumes(res.data?.resumes || []);
      if (!selectedId && res.data?.resumes?.length > 0) {
        setSelectedId(res.data.resumes[0].id);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to load resumes" });
    } finally {
      setLoading(false);
    }
  };

  const loadResume = async (id) => {
    try {
      const res = await getResume(id);
      const r = res.data?.resume;
      if (!r) return;
      setForm({
        title: r.title || "",
        summary: r.summary || "",
        template: r.template || "modern",
        skills: r.skills?.length ? r.skills.map(s => ({ skill: s.skill || "", skill_type: s.skill_type || "technical" })) : [{ ...emptySkill }],
        experience: r.experience?.length ? r.experience.map(e => ({
          company: e.company || "",
          role: e.role || "",
          description: e.description || "",
          start_date: e.start_date ? e.start_date.split("T")[0] : "",
          end_date: e.end_date ? e.end_date.split("T")[0] : ""
        })) : [{ ...emptyExperience }],
        projects: r.projects?.length ? r.projects.map(p => ({
          title: p.title || "",
          description: p.description || "",
          technologies: p.technologies || "",
          github_link: p.github_link || "",
          live_link: p.live_link || ""
        })) : [{ ...emptyProject }],
        education: r.education?.length ? r.education.map(ed => ({
          institution: ed.institution || "",
          degree: ed.degree || "",
          field: ed.field || "",
          start_year: ed.start_year || "",
          end_year: ed.end_year || "",
          cgpa: ed.cgpa || ""
        })) : [{ ...emptyEducation }]
      });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to load resume" });
    }
  };

  const handleCreateNew = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await createResume({ title: "New Resume", summary: "" });
      const id = res.data?.resumeId;
      if (id) {
        setResumes(prev => [...prev, { id, title: "New Resume", ats_score: 0 }]);
        setSelectedId(id);
        setForm({
          title: "New Resume",
          summary: "",
          template: "modern",
          skills: [{ ...emptySkill }],
          experience: [{ ...emptyExperience }],
          projects: [{ ...emptyProject }],
          education: [{ ...emptyEducation }]
        });
        setMessage({ type: "success", text: "Resume created" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to create resume" });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!selectedId) return;
    if (!form.title?.trim()) {
      setMessage({ type: "error", text: "Title is required" });
      return;
    }
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await updateResume(selectedId, form);
      setMessage({ type: "success", text: "Resume saved" });
      loadResumes();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to save resume" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId || !confirm("Delete this resume?")) return;
    setSaving(true);
    try {
      await deleteResume(selectedId);
      setResumes(prev => prev.filter(r => r.id !== selectedId));
      setSelectedId(resumes.find(r => r.id !== selectedId)?.id || null);
      setMessage({ type: "success", text: "Resume deleted" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to delete" });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!selectedId) return;
    try {
      await downloadResumePdf(selectedId);
      setMessage({ type: "success", text: "PDF downloaded" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to download PDF" });
    }
  };

  const updateField = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const addSkill = () => setForm(f => ({ ...f, skills: [...f.skills, { ...emptySkill }] }));
  const removeSkill = (i) => setForm(f => ({ ...f, skills: f.skills.filter((_, idx) => idx !== i) }));
  const updateSkill = (i, field, val) => setForm(f => ({
    ...f,
    skills: f.skills.map((s, idx) => idx === i ? { ...s, [field]: val } : s)
  }));

  const addExperience = () => setForm(f => ({ ...f, experience: [...f.experience, { ...emptyExperience }] }));
  const removeExperience = (i) => setForm(f => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }));
  const updateExperience = (i, field, val) => setForm(f => ({
    ...f,
    experience: f.experience.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
  }));

  const addProject = () => setForm(f => ({ ...f, projects: [...f.projects, { ...emptyProject }] }));
  const removeProject = (i) => setForm(f => ({ ...f, projects: f.projects.filter((_, idx) => idx !== i) }));
  const updateProject = (i, field, val) => setForm(f => ({
    ...f,
    projects: f.projects.map((p, idx) => idx === i ? { ...p, [field]: val } : p)
  }));

  const addEducation = () => setForm(f => ({ ...f, education: [...f.education, { ...emptyEducation }] }));
  const removeEducation = (i) => setForm(f => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }));
  const updateEducation = (i, field, val) => setForm(f => ({
    ...f,
    education: f.education.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
  }));

  const inputClass = "w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading resumes...</div>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Resume Builder
        </h1>
        <p className="text-slate-400">Create and manage your ATS-friendly resumes.</p>
      </div>

      {/* Resume selector */}
      <div className="glass-card p-6">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedId || ""}
            onChange={(e) => setSelectedId(e.target.value ? parseInt(e.target.value, 10) : null)}
            className={inputClass + " max-w-xs"}
          >
            <option value="">Select a resume</option>
            {resumes.map(r => (
              <option key={r.id} value={r.id}>{r.title} {r.ats_score ? `(${r.ats_score}%)` : ""}</option>
            ))}
          </select>
          <button onClick={handleCreateNew} disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50">
            + New Resume
          </button>
          {selectedId && (
            <>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => onNavigate?.("ats-analyzer")} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium">
                ATS Analyzer
              </button>
              <button onClick={handleDownloadPdf} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white font-medium">
                Download PDF
              </button>
              <button onClick={handleDelete} disabled={saving} className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-medium">
                Delete
              </button>
            </>
          )}
        </div>
        {message.text && (
          <p className={`mt-3 text-sm ${message.type === "error" ? "text-red-400" : "text-green-400"}`}>
            {message.text}
          </p>
        )}
      </div>

      {!selectedId ? (
        <div className="glass-card p-6 text-center text-slate-400">
          Create a new resume or select one from the list above.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Basic info */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">Basic Info</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. Software Engineer Resume"
                  className={inputClass}
                  maxLength={150}
                />
              </div>
              <div>
                <label className={labelClass}>Professional Summary</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  placeholder="3-5 sentences highlighting your key strengths..."
                  className={inputClass + " min-h-[100px]"}
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">Skills</h2>
            {form.skills.map((s, i) => (
              <div key={i} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={s.skill}
                  onChange={(e) => updateSkill(i, "skill", e.target.value)}
                  placeholder="e.g. JavaScript, React"
                  className={inputClass + " flex-1"}
                />
                <select
                  value={s.skill_type}
                  onChange={(e) => updateSkill(i, "skill_type", e.target.value)}
                  className={inputClass + " w-32"}
                >
                  <option value="technical">Technical</option>
                  <option value="soft">Soft</option>
                </select>
                <button type="button" onClick={() => removeSkill(i)} className="px-3 py-2 rounded-lg bg-red-600/50 hover:bg-red-600 text-white font-medium">
                  ×
                </button>
              </div>
            ))}
            <button type="button" onClick={addSkill} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white text-sm">
              + Add Skill
            </button>
          </div>

          {/* Experience */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">Experience</h2>
            {form.experience.map((e, i) => (
              <div key={i} className="border border-slate-600/50 rounded-lg p-4 mb-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">#{i + 1}</span>
                  <button type="button" onClick={() => removeExperience(i)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Company</label>
                    <input type="text" value={e.company} onChange={(ev) => updateExperience(i, "company", ev.target.value)} className={inputClass} placeholder="Company name" />
                  </div>
                  <div>
                    <label className={labelClass}>Role</label>
                    <input type="text" value={e.role} onChange={(ev) => updateExperience(i, "role", ev.target.value)} className={inputClass} placeholder="Job title" />
                  </div>
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input type="date" value={e.start_date} onChange={(ev) => updateExperience(i, "start_date", ev.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input type="date" value={e.end_date} onChange={(ev) => updateExperience(i, "end_date", ev.target.value)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea value={e.description} onChange={(ev) => updateExperience(i, "description", ev.target.value)} className={inputClass + " min-h-[80px]"} placeholder="Bullet points with key achievements..." />
                </div>
              </div>
            ))}
            <button type="button" onClick={addExperience} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white text-sm">
              + Add Experience
            </button>
          </div>

          {/* Projects */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">Projects</h2>
            {form.projects.map((p, i) => (
              <div key={i} className="border border-slate-600/50 rounded-lg p-4 mb-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">#{i + 1}</span>
                  <button type="button" onClick={() => removeProject(i)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                </div>
                <div>
                  <label className={labelClass}>Title</label>
                  <input type="text" value={p.title} onChange={(ev) => updateProject(i, "title", ev.target.value)} className={inputClass} placeholder="Project name" />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea value={p.description} onChange={(ev) => updateProject(i, "description", ev.target.value)} className={inputClass + " min-h-[60px]"} placeholder="What did you build?" />
                </div>
                <div>
                  <label className={labelClass}>Technologies</label>
                  <input type="text" value={p.technologies} onChange={(ev) => updateProject(i, "technologies", ev.target.value)} className={inputClass} placeholder="React, Node.js, MongoDB" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>GitHub Link</label>
                    <input type="url" value={p.github_link} onChange={(ev) => updateProject(i, "github_link", ev.target.value)} className={inputClass} placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label className={labelClass}>Live Link</label>
                    <input type="url" value={p.live_link} onChange={(ev) => updateProject(i, "live_link", ev.target.value)} className={inputClass} placeholder="https://..." />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addProject} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white text-sm">
              + Add Project
            </button>
          </div>

          {/* Education */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">Education</h2>
            {form.education.map((ed, i) => (
              <div key={i} className="border border-slate-600/50 rounded-lg p-4 mb-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">#{i + 1}</span>
                  <button type="button" onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Institution</label>
                    <input type="text" value={ed.institution} onChange={(ev) => updateEducation(i, "institution", ev.target.value)} className={inputClass} placeholder="University name" />
                  </div>
                  <div>
                    <label className={labelClass}>Degree</label>
                    <input type="text" value={ed.degree} onChange={(ev) => updateEducation(i, "degree", ev.target.value)} className={inputClass} placeholder="B.Tech, M.Sc" />
                  </div>
                  <div>
                    <label className={labelClass}>Field</label>
                    <input type="text" value={ed.field} onChange={(ev) => updateEducation(i, "field", ev.target.value)} className={inputClass} placeholder="Computer Science" />
                  </div>
                  <div>
                    <label className={labelClass}>CGPA</label>
                    <input type="text" value={ed.cgpa} onChange={(ev) => updateEducation(i, "cgpa", ev.target.value)} className={inputClass} placeholder="8.5" />
                  </div>
                  <div>
                    <label className={labelClass}>Start Year</label>
                    <input type="number" value={ed.start_year} onChange={(ev) => updateEducation(i, "start_year", ev.target.value)} className={inputClass} placeholder="2020" />
                  </div>
                  <div>
                    <label className={labelClass}>End Year</label>
                    <input type="number" value={ed.end_year} onChange={(ev) => updateEducation(i, "end_year", ev.target.value)} className={inputClass} placeholder="2024" />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addEducation} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white text-sm">
              + Add Education
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeBuilder;
