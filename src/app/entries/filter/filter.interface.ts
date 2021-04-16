export interface IFilterOption {
  label: string;
  value: number;
}

export interface IFilter {
  field: IFilterOption;
  value: IFilterOption;
}
