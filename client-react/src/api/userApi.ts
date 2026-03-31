import { apiClient } from './apiClient';
import type { IUser } from '../types/user.types';

export async function getCurrentUser(): Promise<IUser> {
  const response = await apiClient.get<IUser>('/api/users/current');
  return response.data;
}

export async function getUserById(userId: number): Promise<IUser> {
  const response = await apiClient.get<IUser>(`/api/users/${userId}`);
  return response.data;
}

export async function getUsers(): Promise<IUser[]> {
  const response = await apiClient.get<IUser[]>('/api/users');
  return response.data;
}
