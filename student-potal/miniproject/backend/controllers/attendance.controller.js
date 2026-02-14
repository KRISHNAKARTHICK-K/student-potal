const db = require("../config/db");

/* ============================
   TEACHER: Mark attendance
   (per course)
============================ */
const markAttendance = (req, res) => {
  try {
    const { student_id, course_id, date, status } = req.body;
    const teacher_id = req.user.id;

    // Validation
    if (!student_id || !course_id || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "student_id, course_id, date, and status are required"
      });
    }

    if (!["present", "absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be 'present' or 'absent'"
      });
    }

    // 1) Ensure course belongs to this teacher
    db.query(
      "SELECT id FROM courses WHERE id = ? AND teacher_id = ?",
      [course_id, teacher_id],
      (errCourse, courses) => {
        if (errCourse) {
          console.error("Course check error:", errCourse);
          return res.status(500).json({
            success: false,
            message: "Database error while validating course"
          });
        }

        if (!courses.length) {
          return res.status(403).json({
            success: false,
            message: "You are not assigned to this course"
          });
        }

        // 2) Ensure student exists and is enrolled in this course
        const studentQuery =
          "SELECT u.id FROM users u WHERE u.id = ? AND u.role = 'student'";

        db.query(studentQuery, [student_id], (errStudent, students) => {
          if (errStudent) {
            console.error("Student check error:", errStudent);
            return res.status(500).json({
              success: false,
              message: "Database error while validating student"
            });
          }

          if (!students.length) {
            return res.status(404).json({
              success: false,
              message: "Student not found"
            });
          }

          const enrollmentQuery =
            "SELECT 1 FROM enrollments WHERE student_id = ? AND course_id = ?";

          db.query(
            enrollmentQuery,
            [student_id, course_id],
            (errEnroll, enrollments) => {
              if (errEnroll) {
                console.error("Enrollment check error:", errEnroll);
                return res.status(500).json({
                  success: false,
                  message: "Database error while validating enrollment"
                });
              }

              if (!enrollments.length) {
                return res.status(400).json({
                  success: false,
                  message: "Student is not enrolled in this course"
                });
              }

              // 3) Prevent duplicate attendance for same date & course
              const duplicateQuery = `
                SELECT id 
                FROM attendance 
                WHERE student_id = ? 
                  AND course_id = ? 
                  AND date = ?
              `;

              db.query(
                duplicateQuery,
                [student_id, course_id, date],
                (errDup, rows) => {
                  if (errDup) {
                    console.error("Duplicate check error:", errDup);
                    return res.status(500).json({
                      success: false,
                      message: "Database error while checking duplicates"
                    });
                  }

                  if (rows.length > 0) {
                    return res.status(400).json({
                      success: false,
                      message:
                        "Attendance already marked for this student, course and date"
                    });
                  }

                  // 4) Insert attendance
                  const insertQuery = `
                    INSERT INTO attendance 
                      (student_id, course_id, date, status, marked_by) 
                    VALUES (?, ?, ?, ?, ?)
                  `;

                  db.query(
                    insertQuery,
                    [student_id, course_id, date, status, teacher_id],
                    (errInsert) => {
                      if (errInsert) {
                        console.error("Insert error:", errInsert);
                        return res.status(500).json({
                          success: false,
                          message: "Failed to mark attendance"
                        });
                      }

                      return res.status(201).json({
                        success: true,
                        message: "Attendance marked successfully"
                      });
                    }
                  );
                }
              );
            }
          );
        });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* ============================
   STUDENT: View own attendance
   (overall + per course)
============================ */
const getMyAttendance = (req, res) => {
  try {
    const student_id = req.user.id;
    const { courseId } = req.query || {};

    const params = [student_id];
    let whereClause = "WHERE a.student_id = ?";

    if (courseId) {
      whereClause += " AND a.course_id = ?";
      params.push(courseId);
    }

    const query = `
      SELECT 
        a.course_id,
        c.name AS course_name,
        a.date,
        a.status
      FROM attendance a
      JOIN courses c ON c.id = a.course_id
      ${whereClause}
      ORDER BY a.date DESC
    `;

    db.query(query, params, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch attendance"
        });
      }

      const total = rows.length;
      const present = rows.filter((r) => r.status === "present").length;
      const absent = rows.filter((r) => r.status === "absent").length;
      const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

      // Per-course summary for dashboard charts
      const byCourse = {};
      rows.forEach((r) => {
        if (!byCourse[r.course_id]) {
          byCourse[r.course_id] = {
            course_id: r.course_id,
            course_name: r.course_name,
            total: 0,
            present: 0,
            absent: 0
          };
        }
        byCourse[r.course_id].total += 1;
        if (r.status === "present") byCourse[r.course_id].present += 1;
        if (r.status === "absent") byCourse[r.course_id].absent += 1;
      });

      Object.values(byCourse).forEach((c) => {
        c.percentage =
          c.total > 0 ? ((c.present / c.total) * 100).toFixed(1) : 0;
      });

      return res.status(200).json({
        success: true,
        summary: {
          total,
          present,
          absent,
          percentage
        },
        byCourse: Object.values(byCourse),
        attendance: rows
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  markAttendance,
  getMyAttendance
};
