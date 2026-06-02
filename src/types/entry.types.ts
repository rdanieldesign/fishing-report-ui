import type { IFileUpload } from './fileUpload.types';

// Copied verbatim from src/app/entries/interfaces/entry.interface.ts — do not modify
export interface IUsgsReading {
  id: string;
  parameterCode: string;
  parameterName: string;
  computationIdentifier: string;
  unit: string;
  value: string;
}

export interface IWeatherConditions {
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
}

export interface INewEntry {
  date: string;
  locationId: number;
  notes: string;
  catchCount: number;
  images: FileList;
}

interface IEntryBase {
  id: string;
  date: string;
  locationId: number;
  locationName: string;
  authorId: number;
  authorName: string;
  authorInitials?: string;
  usgsLocationId?: string;
  catchCount: number;
}

export interface IEntryListItem extends IEntryBase {
  thumbnailUrl?: string;
}

export interface IEntry extends IEntryBase {
  notes: string;
  images: IReportImage[];
  usgsReadings?: IUsgsReading[];
  weatherConditions?: IWeatherConditions;
}

export type ImageUploadStatus = 'uploading' | 'complete' | 'failed';

export interface IReportImage {
  id: number;
  imageURL: string | null;
  imageKey: string | null;
  status: ImageUploadStatus;
}

export interface IEntryFormValues {
  notes: string;
  locationId: number | '';
  date: string;
  catchCount: number | '';
  images: IFileUpload[];
}
