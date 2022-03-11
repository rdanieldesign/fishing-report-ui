import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IStringMap } from 'src/app/shared/interfaces/generic.interface';
import { EntryService } from '../entry.service';
import { IEntry } from '../interfaces/entry.interface';
import { EntryListViewAbstractService } from './entry-list-view.abstract.service';

@Injectable({
  providedIn: 'root',
})
export class EntryListViewService implements EntryListViewAbstractService {
  constructor(private readonly entryService: EntryService) {}

  getPageHeader() {
    return of('All Entries');
  }

  getEntryList(paramObj: IStringMap): Observable<IEntry[]> {
    return this.entryService.getAllEntries(paramObj);
  }

  getShowCreateButton(): Observable<boolean> {
    return of(false);
  }

  getShowFilters(): Observable<boolean> {
    return of(true);
  }
}
