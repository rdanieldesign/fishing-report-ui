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

export interface INewEntry {
  date: string;
  locationId: number;
  notes: string;
  catchCount: number;
  images: FileList;
}

export interface IEntry extends Omit<INewEntry, 'images'> {
  id: string;
  locationName: string;
  authorId: number;
  authorName: string;
  authorInitials?: string;
  locationId: number;
  usgsLocationId?: string;
  images: IReportImage[];
  usgsReadings?: IUsgsReading[];
  thumbnailUrl?: string;
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
