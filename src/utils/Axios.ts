import axios from "axios";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_WEBSITE_URL, // Access Vite environment variable
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Set up a request interceptor for Authorization token
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default Axios;
