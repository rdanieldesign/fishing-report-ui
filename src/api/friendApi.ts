import { apiClient } from './apiClient';
import { FriendStatus } from '../types/friend.types';
import type { IFriendshipDetails } from '../types/friend.types';
import type { IUser } from '../types/user.types';

export async function getAllFriends(): Promise<IFriendshipDetails[]> {
  const response = await apiClient.get<IFriendshipDetails[]>('/api/friends');
  return response.data;
}

export async function getFriendRequests(): Promise<IFriendshipDetails[]> {
  const response = await apiClient.get<IFriendshipDetails[]>('/api/friends/requests');
  return response.data;
}

export async function getPendingFriendRequests(): Promise<IFriendshipDetails[]> {
  const response = await apiClient.get<IFriendshipDetails[]>('/api/friends/pending');
  return response.data;
}

export async function getFriendOptions(): Promise<IUser[]> {
  const response = await apiClient.get<IUser[]>('/api/friends/options');
  return response.data;
}

// Angular sent { userId, status } as the body for all friendship mutations —
// preserve the exact payload shape so the backend contract is unchanged.
export async function requestFriendship(friendId: number): Promise<number> {
  const response = await apiClient.post<number>('/api/friends', {
    userId: friendId,
    status: FriendStatus.Requested,
  });
  return response.data;
}

export async function confirmFriendship(friendId: number): Promise<number> {
  const response = await apiClient.put<number>('/api/friends', {
    userId: friendId,
    status: FriendStatus.Confirmed,
  });
  return response.data;
}

export async function deleteFriendship(friendId: number): Promise<IFriendshipDetails[]> {
  const response = await apiClient.put<IFriendshipDetails[]>('/api/friends', {
    userId: friendId,
    status: FriendStatus.Rejected,
  });
  return response.data;
}
