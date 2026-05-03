import { apiClient } from './apiClient';
import type { IEntry } from '../types/entry.types';

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

async function gqlRequest<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const response = await apiClient.post<T>('/graphql', {
    query,
    variables,
  });
  return response.data;
}

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
