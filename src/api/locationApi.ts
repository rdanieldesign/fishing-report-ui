import { apiClient } from './apiClient';
import type { ILocation, INewLocation } from '../types/location.types';

export async function getAllLocations(): Promise<ILocation[]> {
  const response = await apiClient.get<ILocation[]>('/api/locations');
  return response.data;
}

export async function getLocationById(locationId: number): Promise<ILocation> {
  const response = await apiClient.get<ILocation>(
    `/api/locations/${locationId}`,
  );
  return response.data;
}

// Returns the new location's id
export async function createLocation(
  newLocation: INewLocation,
): Promise<number> {
  const response = await apiClient.post<number>('/api/locations', newLocation);
  return response.data;
}

export async function updateLocation(
  id: number,
  data: INewLocation,
): Promise<void> {
  await apiClient.put(`/api/locations/${id}`, data);
}
