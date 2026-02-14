-- Core academic management schema for the portal

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  teacher_id INT NULL,
  department VARCHAR(255) NOT NULL,
  semester VARCHAR(50) NOT NULL,
  CONSTRAINT fk_courses_teacher
    FOREIGN KEY (teacher_id) REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS enrollments (
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  PRIMARY KEY (student_id, course_id),
  CONSTRAINT fk_enroll_student
    FOREIGN KEY (student_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_enroll_course
    FOREIGN KEY (course_id) REFERENCES courses(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present', 'absent') NOT NULL,
  marked_by INT NOT NULL,
  CONSTRAINT fk_att_student
    FOREIGN KEY (student_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_att_course
    FOREIGN KEY (course_id) REFERENCES courses(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_att_teacher
    FOREIGN KEY (marked_by) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT uc_attendance_unique
    UNIQUE (student_id, course_id, date)
);

CREATE TABLE IF NOT EXISTS timetable (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  day VARCHAR(20) NOT NULL,
  time VARCHAR(20) NOT NULL,
  room VARCHAR(50) NOT NULL,
  CONSTRAINT fk_tt_course
    FOREIGN KEY (course_id) REFERENCES courses(id)
    ON DELETE CASCADE
);

