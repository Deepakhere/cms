import axios from "axios";
import { API_BASE_URL, API_TIMEOUT, DEBUG } from "../config/environment";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for debugging and adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    if (DEBUG) {
      console.log("🚀 API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    if (DEBUG) {
      console.error("❌ API Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for debugging and error handling
apiClient.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log("✅ API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    if (DEBUG) {
      console.error("❌ API Response Error:", {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
        type: error.code === "ERR_NETWORK" ? "CORS/Network Error" : "API Error",
      });
    }

    // Handle CORS and network errors
    if (error.code === "ERR_NETWORK" || error.message.includes("CORS")) {
      console.error("🚫 CORS Error detected. Check if:");
      console.error("1. Backend server is running");
      console.error("2. Backend has CORS enabled for your frontend URL");
      console.error(
        "3. API URL is correct:",
        error.config?.baseURL || "No base URL"
      );
    }

    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - could trigger logout
      console.warn("🔒 Unauthorized access detected");
    }

    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Authentication endpoints
  auth: {
    login: (credentials) => apiClient.post("/api/login", credentials),
    register: (userData) => apiClient.post("/api/register", userData),
    isAuthenticated: () => apiClient.get("/api/isAuthenticate"),
    logout: () => apiClient.post("/api/logout"),
  },

  // Content/Page management endpoints
  pages: {
    getAll: () => apiClient.get("/api/gethomedata"),
    create: (pageData) => apiClient.post("/api/homepagedata", pageData),
    save: (formData) =>
      apiClient.post("/api/pagesavedata", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => apiClient.delete(`/api/deletedata/${id}`),
    generatePage: (url) => apiClient.get(`/api/generatepage/${url}`),
    getBlogList: () => apiClient.get("/api/bloglist"),
  },

  // File upload endpoints
  files: {
    upload: (formData) =>
      apiClient.post("/api/homepagedata", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
  },

  // Generic methods for custom endpoints
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};

export default apiService;

// Export axios instance for direct use if needed
export { apiClient };
