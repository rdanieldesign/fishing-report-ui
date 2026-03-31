import { apiClient } from './apiClient';
import { useAuthStore } from '../stores/authStore';
import type { ICredentials, INewUser } from '../types/auth.types';

// Returns the raw token string — Angular login/signup both returned Observable<string>
export async function login(credentials: ICredentials): Promise<string> {
  const response = await apiClient.post<string>('/api/auth/login', credentials);
  useAuthStore.getState().setToken(response.data);
  return response.data;
}

export async function signup(newUser: INewUser): Promise<string> {
  const response = await apiClient.post<string>('/api/auth/signup', newUser);
  useAuthStore.getState().setToken(response.data);
  return response.data;
}
