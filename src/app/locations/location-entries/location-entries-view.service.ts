import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntryListViewAbstractService } from '../../entries/entry-list/entry-list-view.abstract.service';
import { EntryService } from '../../entries/entry.service';
import { IEntry } from '../../entries/interfaces/entry.interface';
import { IStringMap } from '../../shared/interfaces/generic.interface';
import { ILocation } from '../interfaces/location.interface';
import { LocationAPIService } from '../services/location-api.service';

@Injectable({
  providedIn: 'root',
})
export class LocationEntriesViewService
  implements EntryListViewAbstractService
{
  constructor(
    private readonly entryService: EntryService,
    private readonly locationService: LocationAPIService
  ) {}

  getPageHeader(): Observable<string> {
    const locationId: string = this.getLocationIdFromPath();
    return this.locationService
      .getLocationById(parseInt(locationId))
      .pipe(map((location: ILocation) => location.name));
  }

  getEntryList(paramObj: IStringMap): Observable<IEntry[]> {
    const locationId: string = this.getLocationIdFromPath();
    const locationFilterParam = { ...paramObj, locationId };
    return this.entryService.getAllEntries(locationFilterParam);
  }

  getShowCreateButton(): Observable<boolean> {
    return of(false);
  }

  getShowFilters(): Observable<boolean> {
    return of(false);
  }

  private getLocationIdFromPath() {
    const paths: string[] = location.href.split('/');
    return paths[paths.length - 2];
  }
}
