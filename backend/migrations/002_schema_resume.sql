-- ATS Resume Generator Schema
-- Run this migration to create resume tables

CREATE TABLE IF NOT EXISTS resumes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  summary TEXT,
  template VARCHAR(50) DEFAULT 'modern',
  ats_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(user_id),
  CONSTRAINT fk_resumes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resume_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resume_id INT NOT NULL,
  skill VARCHAR(100) NOT NULL,
  skill_type ENUM('technical','soft') DEFAULT 'technical',
  INDEX(resume_id),
  CONSTRAINT fk_skills_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resume_experience (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resume_id INT NOT NULL,
  company VARCHAR(150),
  role VARCHAR(150),
  description TEXT,
  start_date DATE,
  end_date DATE,
  INDEX(resume_id),
  CONSTRAINT fk_experience_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resume_projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resume_id INT NOT NULL,
  title VARCHAR(150),
  description TEXT,
  technologies TEXT,
  github_link VARCHAR(255),
  live_link VARCHAR(255),
  INDEX(resume_id),
  CONSTRAINT fk_projects_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resume_education (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resume_id INT NOT NULL,
  institution VARCHAR(150),
  degree VARCHAR(150),
  field VARCHAR(150),
  start_year INT,
  end_year INT,
  cgpa DECIMAL(3,2),
  INDEX(resume_id),
  CONSTRAINT fk_education_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);
