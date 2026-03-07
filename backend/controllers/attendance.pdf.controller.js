const PDFDocument = require("pdfkit");
const db = require("../config/db");

// Promisified query
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

async function downloadMyAttendancePDF(req, res) {
  try {
    const studentId = req.user.id;

    const rows = await query(
      `SELECT marked_at, course_id, status
       FROM attendance
       WHERE student_id = ?
       ORDER BY marked_at DESC`,
      [studentId]
    );

    // Set headers BEFORE piping
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="attendance_report.pdf"'
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Title
    doc.fontSize(18).text("Attendance Report", { align: "center" });
    doc.moveDown();

    if (!rows || rows.length === 0) {
      doc.fontSize(12).text("No attendance records found.");
    } else {
      rows.forEach((row) => {
        const formattedDate = row.marked_at
          ? new Date(row.marked_at).toLocaleDateString()
          : "N/A";

        doc.fontSize(12).text(
          `${formattedDate} | Course: ${row.course_id} | ${row.status}`
        );
        doc.moveDown(0.5);
      });
    }

    doc.end();

  } catch (error) {
    console.error("downloadMyAttendancePDF error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate attendance PDF"
      });
    }
  }
}

// 🔥 IMPORTANT: Export correctly
module.exports = downloadMyAttendancePDF;