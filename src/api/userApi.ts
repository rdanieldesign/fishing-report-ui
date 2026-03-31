import { apiClient } from './apiClient';
import type { IUser } from '../types/user.types';

export async function getCurrentUser(): Promise<IUser> {
  const response = await apiClient.get<IUser>('/users/current');
  return response.data;
}

export async function getUserById(userId: number): Promise<IUser> {
  const response = await apiClient.get<IUser>(`/users/${userId}`);
  return response.data;
}

export async function getUsers(): Promise<IUser[]> {
  const response = await apiClient.get<IUser[]>('/users');
  return response.data;
}
