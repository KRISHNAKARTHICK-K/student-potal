const PDFDocument = require("pdfkit");
const db = require("../config/db");

// STUDENT: Download own attendance PDF
const downloadMyAttendancePDF = (req, res) => {
  const student_id = req.user.id;

  db.query(
    "SELECT date, status FROM attendance WHERE student_id = ? ORDER BY date DESC",
    [student_id],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch attendance"
        });
      }

      const doc = new PDFDocument({ margin: 40 });

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=my_attendance.pdf"
      );
      res.setHeader("Content-Type", "application/pdf");

      doc.pipe(res);

      /* =========================
         TITLE
      ========================= */
      doc.fontSize(18).text("My Attendance Report", {
        align: "center"
      });

      doc.moveDown(2);

      /* =========================
         SUMMARY
      ========================= */
      const total = rows.length;
      const present = rows.filter(r => r.status === "present").length;
      const absent = rows.filter(r => r.status === "absent").length;
      const percent =
        total > 0 ? ((present / total) * 100).toFixed(1) : 0;

      doc.fontSize(12);
      doc.text(`Total Classes: ${total}`);
      doc.text(`Present: ${present}`);
      doc.text(`Absent: ${absent}`);
      doc.text(`Attendance: ${percent}%`);

      doc.moveDown(2);

      /* =========================
         TABLE HEADER
      ========================= */
      const startY = doc.y;

      doc.font("Helvetica-Bold").fontSize(11);

      doc.text("S.No", 60, startY);
      doc.text("Date", 120, startY);
      doc.text("Status", 280, startY);

      doc.moveTo(50, startY + 15)
         .lineTo(550, startY + 15)
         .stroke();

      /* =========================
         TABLE ROWS
      ========================= */
      doc.font("Helvetica");

      let y = startY + 25;

      rows.forEach((r, index) => {
        if (y > 750) {
          doc.addPage();
          y = 50;
        }

        doc.text(index + 1, 60, y);
        doc.text(
          new Date(r.date).toISOString().split("T")[0],
          120,
          y
        );
        doc.text(r.status.toUpperCase(), 280, y);

        y += 20;
      });

      doc.end();
    }
  );
};

module.exports = {
  downloadMyAttendancePDF
};
