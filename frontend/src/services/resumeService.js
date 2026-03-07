import api from "./api";

const BASE = "/resume";

/**
 * Create a new resume
 * @param {{ title: string, summary?: string, template?: string }} data
 */
export const createResume = (data) => api.post(BASE, data);

/**
 * List all resumes for the current user
 */
export const listResumes = () => api.get(BASE);

/**
 * Get a single resume by ID
 * @param {number} id
 */
export const getResume = (id) => api.get(`${BASE}/${id}`);

/**
 * Update a resume
 * @param {number} id
 * @param {Object} data - Full resume data including skills, experience, projects, education
 */
export const updateResume = (id, data) => api.put(`${BASE}/${id}`, data);

/**
 * Delete a resume
 * @param {number} id
 */
export const deleteResume = (id) => api.delete(`${BASE}/${id}`);

/**
 * Calculate ATS score for a resume against a job description
 * @param {number} id - Resume ID
 * @param {{ jobDescription: string }} data
 */
export const calculateATS = (id, data) => api.post(`${BASE}/${id}/ats`, data);

/**
 * Get PDF download URL (for link href - auth via cookie/session if applicable)
 * For authenticated download, use downloadResumePdf instead
 */
export const getResumePdfUrl = (id) => {
  const base = api.defaults.baseURL || "http://localhost:5000/api";
  return `${base}${BASE}/${id}/pdf`;
};

/**
 * Download resume as PDF (uses auth header, triggers browser download)
 * @param {number} id
 */
export const downloadResumePdf = async (id) => {
  const res = await api.get(`${BASE}/${id}/pdf`, { responseType: "blob" });
  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${id}_resume.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};
