import { apiClient } from './apiClient';
import type {
  IEntry,
  IEntryFormValues,
  IEntryListItem,
  IWeatherConditions,
  ImageUploadStatus,
} from '../types/entry.types';
import type { IStringMap } from '../types/generic.types';
import type { ITopLocation } from '../components/widgets/topLocation.types';
import { gqlRequest } from './graphQLClient';

interface GqlReportBase {
  id: number;
  date: string;
  catchCount: number;
  location: { id: number; name: string; usgsLocationId?: string };
  author: { id: number; name: string };
}

interface GqlReport extends GqlReportBase {
  notes: string;
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
  weatherConditions?: {
    tempMax: number;
    tempMin: number;
    tempMean: number;
    precipitationSum: number;
    priorRainfall: number;
    weatherCode: number;
    windSpeedMax: number;
    cloudCoverMin: number;
    cloudCoverMax: number;
    cloudCoverMean: number;
  };
}

interface GqlReportListItem extends GqlReportBase {
  thumbnailUrl?: string;
}

interface GqlReportResponse {
  data: { report: GqlReport };
}

interface GqlTopLocation {
  locationId: number;
  locationName: string;
}

interface GqlReportListResponse {
  data: {
    allReports: GqlReportListItem[];
    topLocationByCurrentMonth: GqlTopLocation | null;
  };
}

export interface IEntryListResponse {
  entries: IEntryListItem[];
  topLocation: ITopLocation | null;
}

export interface IPaginatedReportsResponse {
  reports: IEntryListItem[];
  nextCursor: string | null;
}

const REPORT_DETAIL_QUERY = /* GraphQL */ `
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
      weatherConditions {
        tempMax
        tempMin
        tempMean
        precipitationSum
        weatherCode
        windSpeedMax
        cloudCoverMin
        cloudCoverMax
        cloudCoverMean
        priorRainfall
      }
      author {
        id
        name
      }
    }
  }
`;

const REPORT_LIST_QUERY = /* GraphQL */ `
  query GetReportList($locationId: Int, $authorId: Int) {
    allReports(locationId: $locationId, authorId: $authorId) {
      id
      date
      catchCount
      thumbnailUrl
      location {
        id
        name
      }
      author {
        id
        name
      }
    }
    topLocationByCurrentMonth {
      locationName
      locationId
    }
  }
`;

interface GqlPaginatedReportsResponse {
  data: {
    paginatedReports: {
      reports: GqlReportListItem[];
      nextCursor: string | null;
    };
  };
}

interface GqlTopLocationResponse {
  data: {
    topLocationByCurrentMonth: GqlTopLocation | null;
  };
}

const PAGINATED_REPORTS_QUERY = /* GraphQL */ `
  query PaginatedReports(
    $cursor: String
    $locationId: Int
    $authorId: Int
    $limit: Int
  ) {
    paginatedReports(
      cursor: $cursor
      locationId: $locationId
      authorId: $authorId
      limit: $limit
    ) {
      reports {
        id
        date
        catchCount
        thumbnailUrl
        location {
          id
          name
        }
        author {
          id
          name
        }
      }
      nextCursor
    }
  }
`;

const TOP_LOCATION_QUERY = /* GraphQL */ `
  query GetTopLocation {
    topLocationByCurrentMonth {
      locationName
      locationId
    }
  }
`;

export async function getPaginatedReports(
  cursor: string | null,
  params: { locationId?: number; authorId?: number; limit?: number } = {},
): Promise<IPaginatedReportsResponse> {
  const variables = {
    cursor: cursor ?? undefined,
    locationId: params.locationId,
    authorId: params.authorId,
    limit: params.limit,
  };
  const result = await gqlRequest<GqlPaginatedReportsResponse>(
    PAGINATED_REPORTS_QUERY,
    variables,
  );
  const { reports, nextCursor } = result.data.paginatedReports;
  return {
    reports: reports.map(mapReportListItem),
    nextCursor,
  };
}

export async function getTopLocation(): Promise<ITopLocation | null> {
  const result = await gqlRequest<GqlTopLocationResponse>(
    TOP_LOCATION_QUERY,
    {},
  );
  return result.data.topLocationByCurrentMonth;
}

function mapReport(r: GqlReport): IEntry {
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
    weatherConditions: r.weatherConditions
      ? (r.weatherConditions as IWeatherConditions)
      : undefined,
  };
}

function mapReportListItem(r: GqlReportListItem): IEntryListItem {
  return {
    id: String(r.id),
    date: r.date,
    catchCount: r.catchCount,
    locationId: r.location.id,
    locationName: r.location.name,
    usgsLocationId: r.location.usgsLocationId,
    authorId: r.author.id,
    authorName: r.author.name,
    thumbnailUrl: r.thumbnailUrl,
    // TODO: handle this on the BE instead
    authorInitials: r.author.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase(),
  };
}

export async function getEntry(reportId: number): Promise<IEntry> {
  const result = await gqlRequest<GqlReportResponse>(REPORT_DETAIL_QUERY, {
    reportId,
  });
  return mapReport(result.data.report);
}

export async function getAllEntries(
  params: IStringMap = {},
): Promise<IEntryListResponse> {
  const variables = {
    locationId: params.locationId ? Number(params.locationId) : undefined,
    authorId: params.authorId ? Number(params.authorId) : undefined,
  };
  const result = await gqlRequest<GqlReportListResponse>(
    REPORT_LIST_QUERY,
    variables,
  );
  return {
    entries: result.data.allReports.map(mapReportListItem),
    topLocation: result.data.topLocationByCurrentMonth,
  };
}

interface ImageMetadata {
  filename: string;
  mimetype: string;
}

interface ISignedImageURL {
  uploadUrl: string;
  key: string;
  filename: string;
}

interface ReportEditPayload {
  locationId: number;
  catchCount: number;
  date: string;
  notes: string;
  newImageMetadata: ImageMetadata[];
  imageKeysToKeep: string[];
}

interface ReportCreatePayload {
  locationId: number;
  catchCount: number;
  date: string;
  notes: string;
  imageMetadata: ImageMetadata[];
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
    (response.data.signedImageUrls ?? []).map((url) => {
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
