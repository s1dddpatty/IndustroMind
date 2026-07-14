import axios from "axios";
import { env } from "../env";
import { getSessionToken, clearSession } from "../auth/session";

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getSessionToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global 401 handling
    if (error.response?.status === 401) {
      // Skip clearing session if the request was actually to the login endpoint
      if (error.config?.url && !error.config.url.includes("/auth/login")) {
        clearSession();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
    }
    
    // Always reject so the repository layer can handle the specific error mapping
    return Promise.reject(error);
  }
);
