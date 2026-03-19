import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export const apiClient = axios.create();

// Request interceptor: attach auth token header to every outgoing request.
// useAuthStore.getState() is the Zustand escape hatch for reading state outside React.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
});

// Response interceptor: on 401 clear the stored token and redirect to login.
// TODO (Phase 5): once RequireAuth is in place, the window.location redirect can be
// replaced with a stored navigate() ref — RequireAuth will handle the redirect
// automatically when it sees a null token.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      useAuthStore.getState().clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
