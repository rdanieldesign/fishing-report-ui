export interface INewEntry {
    date: string;
    location: string;
    narrative: string;
}

export interface IEntry extends INewEntry {
    id: string;
}

export interface IEntryMap {
    [key: string]: IEntry;
}