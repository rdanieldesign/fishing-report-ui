import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllEntries(): Observable<string[]> {
    return this.httpClient.get<string[]>('http://localhost:8000/api/entries');
  }

  createEntry(newEntry: string): Observable<string> {
    return this.httpClient.post<string>('http://localhost:8000/api/entries', newEntry);
  }
}
