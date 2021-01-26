import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IEntry, INewEntry } from './interfaces/entry.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllEntries(): Observable<IEntry[]> {
    return this.httpClient.get<IEntry[]>(`${environment.apiDomain}/api/reports`);
  }

  getEntry(entryId: string): Observable<IEntry> {
    return this.httpClient.get<IEntry>(`${environment.apiDomain}/api/reports/${entryId}`)
  }

  createEntry(newEntry: INewEntry): Observable<string> {
    return this.httpClient.post<string>(`${environment.apiDomain}/api/reports`, newEntry);
  }

  deleteEntry(entryId: string): Observable<null> {
    return this.httpClient.delete<null>(`${environment.apiDomain}/api/reports/${entryId}`)
  }

}
