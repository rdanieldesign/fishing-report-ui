export interface INewEntry {
  date: string;
  locationId: number;
  notes: string;
  catchCount: number;
}

export interface IEntry extends INewEntry {
  id: string;
  locationName: string;
  authorId: number;
  authorName: string;
  locationId: number;
}
