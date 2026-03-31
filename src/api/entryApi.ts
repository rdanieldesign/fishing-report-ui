import { apiClient } from './apiClient';
import type { IEntry } from '../types/entry.types';
import type { IStringMap } from '../types/generic.types';

// Always send details=true as required by the API
export async function getAllEntries(params: IStringMap = {}): Promise<IEntry[]> {
  const response = await apiClient.get<IEntry[]>('/reports', {
    params: { details: 'true', ...params },
  });
  return response.data;
}

export async function getMyEntries(params: IStringMap = {}): Promise<IEntry[]> {
  const response = await apiClient.get<IEntry[]>('/reports/my-reports', {
    params: { details: 'true', ...params },
  });
  return response.data;
}

export async function getEntry(entryId: string): Promise<IEntry> {
  const response = await apiClient.get<IEntry>(`/reports/${entryId}`);
  return response.data;
}

// FormData is passed directly — Axios sets Content-Type multipart/form-data
// with the correct boundary automatically; do NOT set it manually.
export async function createEntry(formData: FormData): Promise<string> {
  const response = await apiClient.post<string>('/reports', formData);
  return response.data;
}

export async function editEntry(entryId: string, formData: FormData): Promise<string> {
  const response = await apiClient.put<string>(`/reports/${entryId}`, formData);
  return response.data;
}

export async function deleteEntry(entryId: string): Promise<null> {
  const response = await apiClient.delete<null>(`/reports/${entryId}`);
  return response.data;
}
