import { Observable } from 'rxjs';
import { IStringMap } from 'src/app/shared/interfaces/generic.interface';
import { IEntry } from '../interfaces/entry.interface';

export abstract class EntryListViewAbstractService {
  abstract getPageHeader(): Observable<string>;
  abstract getEntryList(paramObj: IStringMap): Observable<IEntry[]>;
  abstract getShowCreateButton(): Observable<boolean>;
  abstract getShowFilters(): Observable<boolean>;
}
