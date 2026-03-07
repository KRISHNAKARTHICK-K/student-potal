const API = "http://localhost:5000/api/teacher";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json"
});

export const getDashboard = async () => {
  const res = await fetch(`${API}/dashboard`, {
    headers: authHeader()
  });
  return res.json();
};

export const getCourses = async () => {
  const res = await fetch(`${API}/courses`, {
    headers: authHeader()
  });
  return res.json();
};

export const getStudents = async (courseId) => {
  const res = await fetch(`${API}/students?courseId=${courseId}`, {
    headers: authHeader()
  });
  return res.json();
};

export const markAttendance = async (data) => {
  const res = await fetch(`${API}/attendance/mark`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getAttendanceSummary = async () => {
  const res = await fetch(`${API}/attendance/summary`, {
    headers: authHeader()
  });
  return res.json();
};
