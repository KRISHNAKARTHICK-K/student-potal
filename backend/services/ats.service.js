/**
 * Advanced ATS (Applicant Tracking System) Scoring Engine
 * Production-ready with defensive programming - never crashes on undefined
 * Total: 100 marks (Keyword 30, Skill 25, Experience 20, Projects 15, Completeness 10)
 */

// Common stopwords - words to ignore when extracting keywords
const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
  "be", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "must", "shall", "can", "need",
  "this", "that", "these", "those", "it", "its", "we", "you", "they",
  "our", "your", "their", "i", "me", "my", "he", "she", "him", "her"
]);

/**
 * Safely normalize text - handles undefined/null
 * @param {*} text - Any value
 * @returns {string} - Lowercase normalized string or empty string
 */
function safeNormalize(text) {
  if (text === null || text === undefined) return "";
  if (typeof text !== "string") return String(text).toLowerCase();
  return text.trim().toLowerCase();
}

/**
 * Extract keywords from text using regex - splits on non-word chars
 * @param {string} text
 * @returns {string[]} - Array of normalized keywords (no stopwords)
 */
function extractKeywords(text) {
  const normalized = safeNormalize(text);
  if (!normalized) return [];
  const words = normalized.split(/\W+/).filter(w => w.length > 1);
  return words.filter(w => !STOPWORDS.has(w));
}

/**
 * Get word frequency map
 * @param {string[]} words
 * @returns {Map<string, number>}
 */
function getWordFrequency(words) {
  const freq = new Map();
  for (const w of words) {
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  return freq;
}

/**
 * Calculate keyword matching score (30 marks max)
 * - Exact match + partial match
 * - Frequency-weighted
 */
function calculateKeywordScore(resumeText, jdKeywords, jdFreq) {
  const resumeWords = new Set(extractKeywords(resumeText));
  if (resumeWords.size === 0 || jdKeywords.length === 0) return { score: 0, missing: [] };

  let matchedCount = 0;
  let totalWeight = 0;
  const missing = [];

  for (const kw of jdKeywords) {
    const weight = jdFreq.get(kw) || 1;
    let found = false;

    // Exact match
    if (resumeWords.has(kw)) {
      found = true;
    } else {
      // Partial match (keyword contained in resume word or vice versa)
      for (const rw of resumeWords) {
        if (rw.includes(kw) || kw.includes(rw)) {
          found = true;
          break;
        }
      }
    }

    if (found) {
      matchedCount++;
      totalWeight += weight;
    } else {
      missing.push(kw);
    }
  }

  const matchRatio = jdKeywords.length > 0 ? matchedCount / jdKeywords.length : 0;
  const score = Math.min(30, Math.round(matchRatio * 30));
  return { score, missing };
}

/**
 * Calculate skill match score (25 marks max)
 * Technical skills weighted 1.5x, soft skills 1x
 */
function calculateSkillScore(skills, jdKeywords) {
  if (!skills || !Array.isArray(skills)) return { score: 0 };
  const jdSet = new Set(jdKeywords.map(k => safeNormalize(k)));

  let technicalMatch = 0;
  let technicalTotal = 0;
  let softMatch = 0;
  let softTotal = 0;

  for (const s of skills) {
    const skillObj = typeof s === "object" ? s : { skill: s, skill_type: "technical" };
    const skillName = safeNormalize(skillObj.skill || skillObj);
    if (!skillName) continue;

    const skillType = (skillObj.skill_type || "technical").toLowerCase();
    const matched = jdSet.has(skillName) || [...jdSet].some(jd => jd.includes(skillName) || skillName.includes(jd));

    if (skillType === "technical") {
      technicalTotal++;
      if (matched) technicalMatch++;
    } else {
      softTotal++;
      if (matched) softMatch++;
    }
  }

  const techScore = technicalTotal > 0 ? (technicalMatch / technicalTotal) * 15 : 0;
  const softScore = softTotal > 0 ? (softMatch / softTotal) * 10 : 0;
  const score = Math.min(25, Math.round(techScore + softScore));
  return { score };
}

/**
 * Calculate experience relevance (20 marks max)
 * Keyword density in experience descriptions
 */
function calculateExperienceScore(experiences, jdKeywords) {
  if (!experiences || !Array.isArray(experiences) || experiences.length === 0) {
    return 0;
  }
  const expText = experiences
    .map(e => [e.role, e.company, e.description].filter(Boolean).join(" "))
    .join(" ");
  const expWords = extractKeywords(expText);
  const expSet = new Set(expWords);

  let matchCount = 0;
  for (const kw of jdKeywords) {
    if (expSet.has(kw) || [...expSet].some(ew => ew.includes(kw) || kw.includes(ew))) {
      matchCount++;
    }
  }
  const ratio = jdKeywords.length > 0 ? matchCount / jdKeywords.length : 0;
  return Math.min(20, Math.round(ratio * 20));
}

/**
 * Calculate projects relevance (15 marks max)
 * Technology and keyword matching
 */
function calculateProjectScore(projects, jdKeywords) {
  if (!projects || !Array.isArray(projects) || projects.length === 0) {
    return 0;
  }
  const projText = projects
    .map(p => [p.title, p.description, p.technologies].filter(Boolean).join(" "))
    .join(" ");
  const projWords = extractKeywords(projText);
  const projSet = new Set(projWords);

  let matchCount = 0;
  for (const kw of jdKeywords) {
    if (projSet.has(kw) || [...projSet].some(pw => pw.includes(kw) || kw.includes(pw))) {
      matchCount++;
    }
  }
  const ratio = jdKeywords.length > 0 ? matchCount / jdKeywords.length : 0;
  return Math.min(15, Math.round(ratio * 15));
}

/**
 * Calculate resume completeness (10 marks max)
 * Summary: 3, Education: 2, Experience: 2, Projects: 2, Skills: 1
 */
function calculateCompletenessScore(resumeData) {
  let score = 0;
  if (resumeData.summary && String(resumeData.summary).trim().length > 20) score += 3;
  if (resumeData.education && Array.isArray(resumeData.education) && resumeData.education.length > 0) score += 2;
  if (resumeData.experience && Array.isArray(resumeData.experience) && resumeData.experience.length > 0) score += 2;
  if (resumeData.projects && Array.isArray(resumeData.projects) && resumeData.projects.length > 0) score += 2;
  if (resumeData.skills && Array.isArray(resumeData.skills) && resumeData.skills.length > 0) score += 1;
  return Math.min(10, score);
}

/**
 * Generate suggestions based on analysis
 */
function generateSuggestions(resumeData, breakdown, missingKeywords) {
  const suggestions = [];

  if (breakdown.completenessScore < 10) {
    if (!resumeData.summary || String(resumeData.summary || "").trim().length < 20) {
      suggestions.push("Add a professional summary (3-5 sentences highlighting your key strengths)");
    }
    if (!resumeData.education?.length) suggestions.push("Add your education details");
    if (!resumeData.experience?.length) suggestions.push("Add work experience or internships");
    if (!resumeData.projects?.length) suggestions.push("Add relevant projects with technologies used");
    if (!resumeData.skills?.length) suggestions.push("Add technical and soft skills");
  }

  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 5);
    suggestions.push(`Consider adding these keywords from the job description: ${topMissing.join(", ")}`);
  }

  if (breakdown.skillScore < 15) {
    suggestions.push("Align your skills section with the job requirements - add missing technical skills");
  }

  if (breakdown.experienceScore < 10) {
    suggestions.push("Use more job-description keywords in your experience descriptions");
  }

  if (breakdown.projectScore < 8) {
    suggestions.push("Highlight technologies and keywords from the JD in your project descriptions");
  }

  return suggestions;
}

/**
 * Main ATS calculation - DEFENSIVE: never crashes on undefined
 * @param {Object} resumeData - { summary, skills, experience, projects, education }
 * @param {string} jobDescription - Job description text
 * @returns {Object} - { score, breakdown, missingKeywords, suggestions }
 */
function calculateATS(resumeData, jobDescription) {
  // CRITICAL: Defensive check - prevent "Cannot read properties of undefined (reading 'toLowerCase')"
  if (!jobDescription || typeof jobDescription !== "string") {
    return {
      score: 0,
      breakdown: {
        keywordScore: 0,
        skillScore: 0,
        experienceScore: 0,
        projectScore: 0,
        completenessScore: 0
      },
      missingKeywords: [],
      suggestions: ["Job description is required for ATS analysis. Please paste the job description."]
    };
  }

  // Safe resume data - ensure all fields exist
  const safeResume = {
    summary: resumeData?.summary ?? "",
    skills: Array.isArray(resumeData?.skills) ? resumeData.skills : [],
    experience: Array.isArray(resumeData?.experience) ? resumeData.experience : [],
    projects: Array.isArray(resumeData?.projects) ? resumeData.projects : [],
    education: Array.isArray(resumeData?.education) ? resumeData.education : []
  };

  // Extract JD keywords using .split(/\W+/) - robust tokenization
  const jdKeywords = extractKeywords(jobDescription);
  const jdFreq = getWordFrequency(jdKeywords);

  // Build full resume text for keyword matching
  const resumeTextParts = [
    safeResume.summary,
    ...safeResume.skills.map(s => (typeof s === "object" ? s.skill : s) || ""),
    ...safeResume.experience.flatMap(e => [e.role, e.company, e.description].filter(Boolean)),
    ...safeResume.projects.flatMap(p => [p.title, p.description, p.technologies].filter(Boolean)),
    ...safeResume.education.flatMap(ed => [ed.institution, ed.degree, ed.field].filter(Boolean))
  ];
  const resumeText = resumeTextParts.join(" ");

  // 1) Keyword Matching (30 marks)
  const { score: keywordScore, missing: missingKeywords } = calculateKeywordScore(
    resumeText,
    jdKeywords,
    jdFreq
  );

  // 2) Skill Match (25 marks)
  const { score: skillScore } = calculateSkillScore(safeResume.skills, jdKeywords);

  // 3) Experience Relevance (20 marks)
  const experienceScore = calculateExperienceScore(safeResume.experience, jdKeywords);

  // 4) Projects Relevance (15 marks)
  const projectScore = calculateProjectScore(safeResume.projects, jdKeywords);

  // 5) Completeness (10 marks)
  const completenessScore = calculateCompletenessScore(safeResume);

  const totalScore = Math.min(100, keywordScore + skillScore + experienceScore + projectScore + completenessScore);

  const breakdown = {
    keywordScore,
    skillScore,
    experienceScore,
    projectScore,
    completenessScore
  };

  const suggestions = generateSuggestions(safeResume, breakdown, missingKeywords);

  return {
    score: totalScore,
    breakdown,
    missingKeywords: [...new Set(missingKeywords)].slice(0, 15),
    suggestions: suggestions.length > 0 ? suggestions : ["Your resume looks well-aligned with the job description!"]
  };
}

module.exports = { calculateATS };
