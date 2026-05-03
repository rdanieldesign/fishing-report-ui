import { apiClient } from './apiClient';
import type { IEntry } from '../types/entry.types';
import type { IStringMap } from '../types/generic.types';
import { gqlRequest } from './graphQLClient';

interface GqlReportResponse {
  data: {
    report: {
      id: number;
      date: string;
      notes: string;
      catchCount: number;
      location: { id: number; name: string };
      images: { imageURL: string; imageId: string }[];
      usgsReadings: {
        id: string;
        parameterName: string;
        value: string;
        unit: string;
      }[];
      author: { id: number; name: string };
    };
  };
}

const REPORT_QUERY = /* GraphQL */ `
  query GetReport($reportId: Int!) {
    report(id: $reportId) {
      id
      date
      notes
      catchCount
      location {
        id
        name
      }
      images {
        imageURL
        imageId
      }
      usgsReadings {
        id
        parameterName
        value
        unit
      }
      author {
        id
        name
      }
    }
  }
`;

export async function getReportGql(reportId: number): Promise<IEntry> {
  const result = await gqlRequest<GqlReportResponse>(REPORT_QUERY, {
    reportId,
  });
  const r = result.data.report;

  return {
    id: String(r.id),
    date: r.date,
    notes: r.notes,
    catchCount: r.catchCount,
    locationId: r.location.id,
    locationName: r.location.name,
    authorId: r.author.id,
    authorName: r.author.name,
    images: r.images.map((img) => ({
      imageURL: img.imageURL,
      imageId: img.imageId,
    })),
    usgsReadings: r.usgsReadings.map((reading) => ({
      id: reading.id,
      parameterName: reading.parameterName,
      value: reading.value,
      unit: reading.unit,
      parameterCode: '',
      computationIdentifier: '',
    })),
  };
}

export async function getAllEntries(
  params: IStringMap = {},
): Promise<IEntry[]> {
  const response = await apiClient.get<IEntry[]>('/api/reports', { params });
  return response.data;
}

export async function getMyEntries(params: IStringMap = {}): Promise<IEntry[]> {
  const response = await apiClient.get<IEntry[]>('/api/reports/my-reports', {
    params,
  });
  return response.data;
}

export async function getEntry(entryId: string): Promise<IEntry> {
  const response = await apiClient.get<IEntry>(`/api/reports/${entryId}`);
  return response.data;
}

// FormData is passed directly — Axios sets Content-Type multipart/form-data
// with the correct boundary automatically; do NOT set it manually.
export async function createEntry(formData: FormData): Promise<string> {
  const response = await apiClient.post<string>('/api/reports', formData);
  return response.data;
}

export async function editEntry(
  entryId: string,
  formData: FormData,
): Promise<string> {
  const response = await apiClient.put<string>(
    `/api/reports/${entryId}`,
    formData,
  );
  return response.data;
}

export async function deleteEntry(entryId: string): Promise<null> {
  const response = await apiClient.delete<null>(`/api/reports/${entryId}`);
  return response.data;
}
