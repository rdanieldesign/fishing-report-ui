import { apiClient } from './apiClient';

export async function gqlRequest<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const response = await apiClient.post<T>('/graphql', {
    query,
    variables,
  });
  return response.data;
}
