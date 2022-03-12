import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntryListViewAbstractService } from '../entries/entry-list/entry-list-view.abstract.service';
import { EntryService } from '../entries/entry.service';
import { IEntry } from '../entries/interfaces/entry.interface';
import { IStringMap } from '../shared/interfaces/generic.interface';
import { IUser } from './interfaces/user.interface';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserViewService implements EntryListViewAbstractService {
  constructor(
    private readonly entryService: EntryService,
    private readonly userService: UserService
  ) {}

  getPageHeader(): Observable<string> {
    const userId: string = this.getUserIdFromPath();
    return this.userService
      .getUserById(parseInt(userId))
      .pipe(map((user: IUser) => user.name));
  }

  getEntryList(paramObj: IStringMap): Observable<IEntry[]> {
    const authorId: string = this.getUserIdFromPath();
    const userFilterParam = { ...paramObj, authorId };
    return this.entryService.getAllEntries(userFilterParam);
  }

  getShowCreateButton(): Observable<boolean> {
    return of(false);
  }

  getShowFilters(): Observable<boolean> {
    return of(false);
  }

  private getUserIdFromPath() {
    const paths: string[] = location.href.split('/');
    return paths[paths.length - 2];
  }
}
