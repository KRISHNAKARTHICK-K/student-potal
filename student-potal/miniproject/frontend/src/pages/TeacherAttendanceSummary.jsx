import React, { useEffect, useState } from "react";
import api from "../services/api";

function TeacherAttendanceSummary() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH SUMMARY
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/attendance/class");
        setData(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =========================
     DOWNLOAD PDF
  ========================= */
  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/attendance/teacher/pdf",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) throw new Error("PDF failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "class_attendance.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("PDF download failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="bg-white shadow rounded p-6 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Class Attendance Summary
        </h1>

        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export PDF
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded p-6">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Roll</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Present</th>
              <th className="border p-2">Absent</th>
              <th className="border p-2">%</th>
            </tr>
          </thead>

          <tbody>
            {data.map((r, i) => {
              const percent =
                r.total > 0
                  ? ((r.present / r.total) * 100).toFixed(1)
                  : 0;

              return (
                <tr key={i}>
                  <td className="border p-2">{r.name}</td>
                  <td className="border p-2">{r.roll_no || "-"}</td>
                  <td className="border p-2">{r.total}</td>
                  <td className="border p-2">{r.present}</td>
                  <td className="border p-2">{r.absent}</td>
                  <td className="border p-2 font-bold">
                    {percent}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default TeacherAttendanceSummary;
