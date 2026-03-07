import axios from "axios";

const API = "http://localhost:5000/api/resume";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
};

export const createResume = async (data) => {
  return axios.post(API, data, getAuthHeader());
};

export const calculateATS = async (id, jobDescription) => {
  return axios.post(
    `${API}/${id}/ats`,
    { jobDescription },
    getAuthHeader()
  );
};