// Copied verbatim from src/app/entries/filter/filter.interface.ts,
// filter.enum.ts, and filter.constant.ts — do not modify

export enum FilterFields {
  Location,
  Author,
}

export interface IFilterOption {
  label: string;
  value: number;
}

export interface IFilter {
  field: IFilterOption;
  value: IFilterOption;
}

// Maps FilterFields enum values to their API query-param names
export const FilterFieldParams: Record<FilterFields, string> = {
  [FilterFields.Location]: 'locationId',
  [FilterFields.Author]: 'authorId',
};
