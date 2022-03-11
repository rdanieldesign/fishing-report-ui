import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EntryListViewAbstractService } from '../entries/entry-list/entry-list-view.abstract.service';
import { EntryService } from '../entries/entry.service';
import { IEntry } from '../entries/interfaces/entry.interface';
import { IStringMap } from '../shared/interfaces/generic.interface';

@Injectable({
  providedIn: 'root',
})
export class MyEntryListViewService implements EntryListViewAbstractService {
  constructor(private readonly entryService: EntryService) {}

  getPageHeader() {
    return of('My Entries');
  }

  getEntryList(paramObj: IStringMap): Observable<IEntry[]> {
    return this.entryService.getMyEntries(paramObj);
  }

  getShowCreateButton(): Observable<boolean> {
    return of(true);
  }

  getShowFilters(): Observable<boolean> {
    return of(true);
  }
}
