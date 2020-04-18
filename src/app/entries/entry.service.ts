import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IEntry, IEntryMap, INewEntry } from './interfaces/entry.interface';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllEntries(): Observable<IEntry[]> {
    return this.httpClient.get<IEntryMap>('/api/all-entries')
      .pipe(map((entryMap: IEntryMap): IEntry[] => {
        return Object.keys(entryMap).map((key: string) => ({ id: key, ...entryMap[key] }))
      }));
  }

  createEntry(newEntry: INewEntry): Observable<string> {
    return this.httpClient.post<string>('/api/new-entry', newEntry);
  }

}
