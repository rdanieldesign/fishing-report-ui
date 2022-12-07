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
}

export interface IReportImage {
  imageURL: string;
  imageId: string;
}
