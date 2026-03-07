# ATS Resume Generator Module - Setup Guide

## Database Setup

Run the migration to create resume tables:

```bash
mysql -u YOUR_USER -p YOUR_DATABASE < backend/migrations/002_schema_resume.sql
```

Or execute the SQL manually in your MySQL client. The schema creates:
- `resumes` - Main resume metadata
- `resume_skills` - Skills (technical/soft)
- `resume_experience` - Work experience
- `resume_projects` - Projects
- `resume_education` - Education details

## Backend Dependencies

Ensure `pdfkit` is installed (used for PDF generation):

```bash
cd backend && npm install pdfkit
```

## API Endpoints (Student only, requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/resume | Create resume |
| GET | /api/resume | List user's resumes |
| GET | /api/resume/:id | Get single resume |
| PUT | /api/resume/:id | Update resume |
| DELETE | /api/resume/:id | Delete resume |
| POST | /api/resume/:id/ats | Calculate ATS score (body: `{ jobDescription: "..." }`) |
| GET | /api/resume/:id/pdf | Download resume as PDF |

## ATS Scoring (100 total)

- **Keyword Match** (30): JD keywords in resume
- **Skill Match** (25): Technical/soft skills alignment
- **Experience Relevance** (20): Keywords in experience
- **Projects Relevance** (15): Tech/keyword match in projects
- **Completeness** (10): Summary, education, experience, projects, skills present

## Frontend Routes

- **Resume Builder** - Create/edit resumes with dynamic sections
- **ATS Analyzer** - Paste job description, get score + suggestions

Both appear in the student sidebar.

## Error Fix: "Cannot read properties of undefined (reading 'toLowerCase')"

The ATS service now includes:
- Defensive checks for `jobDescription` (must be non-empty string)
- Safe handling of `resumeData.skills`, `resumeData.experience`, etc.
- `.split(/\W+/)` for robust tokenization
- Never crashes on undefined inputs
