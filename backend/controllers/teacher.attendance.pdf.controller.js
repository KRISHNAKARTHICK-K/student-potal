const PDFDocument = require("pdfkit");
const db = require("../config/db");

// TEACHER: Export class attendance PDF
const exportTeacherAttendancePDF = (req, res) => {
  try {
    const query = `
      SELECT 
        a.student_id,
        u.name,
        s.roll_no,
        COUNT(a.id) AS total,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS present,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS absent
      FROM attendance a
      JOIN users u ON u.id = a.student_id
      LEFT JOIN students s ON s.user_id = u.id
      GROUP BY a.student_id, u.name, s.roll_no
      ORDER BY u.name ASC
    `;

    db.query(query, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch class attendance"
        });
      }

      const doc = new PDFDocument({ margin: 40 });

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=class_attendance.pdf"
      );
      res.setHeader("Content-Type", "application/pdf");

      doc.pipe(res);

      /* =========================
         TITLE
      ========================= */
      doc.fontSize(18).text("Class Attendance Report", {
        align: "center"
      });

      doc.moveDown(2);

      /* =========================
         TABLE HEADER
      ========================= */
      const startY = doc.y;

      doc.fontSize(11).font("Helvetica-Bold");

      doc.text("S.No", 40, startY);
      doc.text("Roll No", 80, startY);
      doc.text("Name", 160, startY);
      doc.text("Total", 320, startY);
      doc.text("Present", 370, startY);
      doc.text("Absent", 440, startY);
      doc.text("%", 500, startY);

      doc.moveTo(40, startY + 15)
         .lineTo(550, startY + 15)
         .stroke();

      /* =========================
         TABLE ROWS
      ========================= */
      doc.font("Helvetica");

      let y = startY + 25;

      rows.forEach((r, index) => {
        const percent =
          r.total > 0
            ? ((r.present / r.total) * 100).toFixed(1)
            : 0;

        // Auto new page if overflow
        if (y > 750) {
          doc.addPage();
          y = 50;
        }

        doc.text(index + 1, 40, y);
        doc.text(r.roll_no || "-", 80, y);
        doc.text(r.name, 160, y, { width: 150 });
        doc.text(r.total.toString(), 320, y);
        doc.text(r.present.toString(), 370, y);
        doc.text(r.absent.toString(), 440, y);
        doc.text(percent + "%", 500, y);

        y += 20;
      });

      doc.end();
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
  exportTeacherAttendancePDF
};
