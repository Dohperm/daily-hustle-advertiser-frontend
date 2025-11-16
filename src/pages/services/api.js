// the api here
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "https://daily-hustle-backend-fb9c10f98583.herokuapp.com/api/v1",
  timeout: 60000, // 60 seconds
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default api;
