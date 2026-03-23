import { apiClient } from './apiClient';
import { FriendStatus } from '../types/friend.types';
import type { IFriendshipDetails } from '../types/friend.types';
import type { IUser } from '../types/user.types';

export async function getAllFriends(): Promise<IFriendshipDetails[]> {
  const response = await apiClient.get<IFriendshipDetails[]>('/friends');
  return response.data;
}

export async function getFriendRequests(): Promise<IFriendshipDetails[]> {
  const response = await apiClient.get<IFriendshipDetails[]>('/friends/requests');
  return response.data;
}

export async function getPendingFriendRequests(): Promise<IFriendshipDetails[]> {
  const response = await apiClient.get<IFriendshipDetails[]>('/friends/pending');
  return response.data;
}

export async function getFriendOptions(): Promise<IUser[]> {
  const response = await apiClient.get<IUser[]>('/friends/options');
  return response.data;
}

// Send { userId, status } as the body — the exact payload shape required by the backend.
export async function requestFriendship(friendId: number): Promise<number> {
  const response = await apiClient.post<number>('/friends', {
    userId: friendId,
    status: FriendStatus.Requested,
  });
  return response.data;
}

export async function confirmFriendship(friendId: number): Promise<number> {
  const response = await apiClient.put<number>('/friends', {
    userId: friendId,
    status: FriendStatus.Confirmed,
  });
  return response.data;
}

export async function deleteFriendship(friendId: number): Promise<IFriendshipDetails[]> {
  const response = await apiClient.put<IFriendshipDetails[]>('/friends', {
    userId: friendId,
    status: FriendStatus.Rejected,
  });
  return response.data;
}
