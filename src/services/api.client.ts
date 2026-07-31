import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to attach JWT Access Token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('shopilot_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle token refresh automatically
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('shopilot_refresh_token');
        if (refreshToken) {
          try {
            const res = await axios.post(`${BACKEND_URL}/auth/refresh`, { refreshToken });
            if (res.data.success && res.data.accessToken) {
              localStorage.setItem('shopilot_access_token', res.data.accessToken);
              originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
              return apiClient(originalRequest);
            }
          } catch (refreshErr) {
            localStorage.removeItem('shopilot_access_token');
            localStorage.removeItem('shopilot_refresh_token');
          }
        }
      }
    }

    return Promise.reject(error);
  }
);
