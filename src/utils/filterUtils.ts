import type { IFilter } from '../types/filter.types';

// Translates Angular's FilterAsTextPipe.transform(IFilter[]) into a plain function.
// The pipe also accepted a single IFilter but in practice was always called with an array;
// this function takes the array form only, which is cleaner and type-safe.
function getFilterLabel(filter: IFilter): string {
  if (!(filter.field && filter.value)) return '';
  return `${filter.field.label}: ${filter.value.label}`;
}

export function formatFiltersAsText(filters: IFilter[]): string {
  return filters.reduce((label: string, filter: IFilter): string => {
    if (label) return `${label}, ${getFilterLabel(filter)}`;
    return getFilterLabel(filter);
  }, '');
}
