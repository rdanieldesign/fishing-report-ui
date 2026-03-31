import type { IFilter } from '../types/filter.types';

// Formats an array of active filters into a comma-separated summary string.
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
