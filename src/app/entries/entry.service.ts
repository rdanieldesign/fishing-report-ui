import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IEntry, INewEntry } from './interfaces/entry.interface';
import { environment } from '../../environments/environment';
import { IStringMap } from '../shared/interfaces/generic.interface';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  constructor(private httpClient: HttpClient) {}

  getAllEntries(paramObj: IStringMap = {}): Observable<IEntry[]> {
    let params = new HttpParams().set('details', 'true');
    Object.keys(paramObj).forEach((key) => {
      params = params.append(key, paramObj[key]);
    });
    return this.httpClient.get<IEntry[]>(
      `${environment.apiDomain}/api/reports`,
      { params }
    );
  }

  getMyEntries(paramObj: IStringMap = {}): Observable<IEntry[]> {
    let params = new HttpParams().set('details', 'true');
    Object.keys(paramObj).forEach((key) => {
      params = params.append(key, paramObj[key]);
    });
    return this.httpClient.get<IEntry[]>(
      `${environment.apiDomain}/api/reports/my-reports`,
      { params }
    );
  }

  getEntry(entryId: string): Observable<IEntry> {
    return this.httpClient.get<IEntry>(
      `${environment.apiDomain}/api/reports/${entryId}`
    );
  }

  createEntry(newEntry: INewEntry): Observable<string> {
    return this.httpClient.post<string>(
      `${environment.apiDomain}/api/reports`,
      newEntry
    );
  }

  deleteEntry(entryId: string): Observable<null> {
    return this.httpClient.delete<null>(
      `${environment.apiDomain}/api/reports/${entryId}`
    );
  }
}
