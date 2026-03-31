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

// Response interceptor: on 401, clear the token. RequireAuth watches the Zustand
// store reactively and redirects to /login on the next render — no imperative
// navigate() needed here.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().clearToken();
    }
    return Promise.reject(error);
  }
);
