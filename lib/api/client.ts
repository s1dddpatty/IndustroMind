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
    // Prevent duplicate /api/v1 prefixes if baseURL already ends with /api/v1
    if (config.url && config.url.startsWith("/api/v1/")) {
      config.url = config.url.substring("/api/v1".length);
    }
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
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized encountered on:", error.config?.url);
      clearSession();
    }
    return Promise.reject(error);
  }
);
