import { apiClient } from './apiClient';
import type {
  IEntry,
  IEntryFormValues,
  ImageUploadStatus,
} from '../types/entry.types';
import type { IStringMap } from '../types/generic.types';
import { gqlRequest } from './graphQLClient';

interface ImageMetadata {
  filename: string;
  mimetype: string;
}

interface ISignedImageURL {
  uploadUrl: string;
  key: string;
  filename: string;
}

interface ReportCreatePayload {
  locationId: number;
  catchCount: number;
  date: string;
  notes: string;
  imageMetadata: ImageMetadata[];
}

interface ReportEditPayload {
  locationId: number;
  catchCount: number;
  date: string;
  notes: string;
  newImageMetadata: ImageMetadata[];
  imageKeysToKeep: string[];
}

interface GqlReportResponse {
  data: {
    report: {
      id: number;
      date: string;
      notes: string;
      catchCount: number;
      location: { id: number; name: string; usgsLocationId?: string };
      images: {
        id: number;
        imageKey: string;
        imageURL: string;
        status: ImageUploadStatus;
      }[];
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
        usgsLocationId
      }
      images {
        id
        imageURL
        imageKey
        status
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

export async function getEntry(reportId: number): Promise<IEntry> {
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
    usgsLocationId: r.location.usgsLocationId,
    authorId: r.author.id,
    authorName: r.author.name,
    images: (r.images ?? []).map((img) => ({
      id: img.id,
      imageURL: img.imageURL,
      imageKey: img.imageKey,
      status: img.status,
    })),
    usgsReadings: (r.usgsReadings ?? []).map((reading) => ({
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
  // TODO: handle this on the BE instead
  return response.data.map((r) => ({
    ...r,
    authorInitials: r.authorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase(),
  }));
}

export async function getMyEntries(params: IStringMap = {}): Promise<IEntry[]> {
  const response = await apiClient.get<IEntry[]>('/api/reports/my-reports', {
    params,
  });
  // TODO: handle this on the BE instead
  return response.data.map((r) => ({
    ...r,
    authorInitials: r.authorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase(),
  }));
}

export async function createEntry(data: IEntryFormValues): Promise<string> {
  const reportPayload: ReportCreatePayload = {
    locationId: data.locationId as number,
    catchCount: data.catchCount as number,
    date: data.date,
    notes: data.notes,
    imageMetadata: data.images.map((img) => ({
      filename: img.newFile!.name,
      mimetype: img.newFile!.type,
    })),
  };
  const response = await apiClient.post<{
    reportId: string;
    signedImageUrls: ISignedImageURL[];
  }>('/api/reports', reportPayload);
  // Don't await, allow image upload in background. FE handles async image upload.
  Promise.all(
    response.data.signedImageUrls.map((url) => {
      // TODO: make sure we don't allow duplicate names
      const matchingFile = data.images.find(
        (img) => img.newFile?.name === url.filename,
      );
      return apiClient.put(url.uploadUrl, matchingFile?.newFile, {
        headers: {
          Bucket: import.meta.env.VITE_AWS_ORIGINAL_BUCKET,
          Key: url.key,
          'Content-Type': matchingFile?.newFile?.type,
        },
      });
    }),
  );
  return response.data.reportId;
}

export async function editEntry(
  entryId: string,
  data: ReportEditPayload,
  newFiles: File[] = [],
): Promise<null> {
  const response = await apiClient.put<{
    reportId: string;
    signedImageUrls: ISignedImageURL[];
  }>(`/api/reports/${entryId}`, data);
  if (response.data.signedImageUrls?.length) {
    await Promise.all(
      response.data.signedImageUrls.map((url) => {
        const matchingFile = newFiles.find((f) => f.name === url.filename);
        return apiClient.put(url.uploadUrl, matchingFile, {
          headers: {
            Bucket: import.meta.env.VITE_AWS_ORIGINAL_BUCKET,
            Key: url.key,
            'Content-Type': matchingFile?.type,
          },
        });
      }),
    );
  }
  return null;
}

export async function deleteEntry(entryId: string): Promise<null> {
  const response = await apiClient.delete<null>(`/api/reports/${entryId}`);
  return response.data;
}

export async function fetchUsgsReadings(
  reportId: string,
  usgsLocationId: string,
  reportDate: string,
): Promise<void> {
  await apiClient.post(`/api/reports/${reportId}/usgs`, {
    usgsLocationId,
    reportDate,
  });
}
