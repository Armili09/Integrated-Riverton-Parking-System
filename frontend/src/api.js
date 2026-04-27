import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Prevent duplicate interceptor registration
let isInterceptorSet = false;

export const setupApiInterceptors = (toast) => {
  if (isInterceptorSet) return;
  isInterceptorSet = true;

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      if (status === 401) {
        toast.error("Session Expired", "Please log in again.");
      } else if (status === 403) {
        toast.error(
          "Access Denied",
          serverMessage || "You do not have permission.",
        );
      } else if (status === 404) {
        toast.error(
          "Not Found",
          serverMessage || "The requested resource was not found.",
        );
      } else if (status === 422) {
        toast.error(
          "Validation Error",
          serverMessage || "Please check your inputs.",
        );
      } else if (status >= 500) {
        toast.error(
          "Server Error",
          serverMessage || "Something went wrong. Please try again.",
        );
      } else if (!error.response) {
        toast.error(
          "Connection Error",
          "Unable to reach the server. Check your connection.",
        );
      }

      return Promise.reject(error);
    },
  );
};

export default api;
