import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8082",
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});

export default api;
