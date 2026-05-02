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
  locationId: number;
  images: IReportImage[];
  usgsReadings?: IUsgsReading[];
}

export interface IReportImage {
  imageURL: string;
  imageId: string;
}
