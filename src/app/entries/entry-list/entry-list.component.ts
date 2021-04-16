import { Component, OnDestroy, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';
import { concatMap, filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { ConfirmModalComponent } from 'src/app/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { UserService } from 'src/app/user/services/user.service';
import { IUser } from 'src/app/user/interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';
import { IFilter } from '../filter/filter.interface';
import { IStringMap } from 'src/app/shared/interfaces/generic.interface';
import { FilterFieldParams } from '../filter/filter.constant';
import { IEntry } from '../interfaces/entry.interface';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css'],
  host: { class: 'flex-full-height centered-container' },
})
export class EntryListComponent implements OnInit, OnDestroy {
  entries: IEntry[] = [];
  filters: IFilter[] = [];
  loading = true;
  currentUserId$: Observable<
    number | null
  > = this.userService.currentUser$.pipe(
    map((user: IUser | null): number | null => (user ? user.id : null))
  );
  filtersOpen = false;

  private destroy$ = new Subject();

  constructor(
    private readonly entrylistservice: EntryService,
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setEntries();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteEntry(id: string) {
    this.confirmDelete()
      .pipe(
        take(1),
        filter(Boolean),
        tap(() => {
          this.loading = true;
        }),
        concatMap(() => this.entrylistservice.deleteEntry(id)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.setEntries();
      });
  }

  confirmDelete(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: { message: 'Are you sure you want to delete this report?' },
    });
    return dialogRef.afterClosed();
  }

  applyFilter(filters: IFilter[]) {
    this.setEntries(filters);
  }

  clearAllFilters() {
    this.setEntries();
  }

  filtersOpened() {
    this.filtersOpen = true;
  }

  filtersClosed() {
    this.filtersOpen = false;
  }

  private setEntries(filters: IFilter[] = []) {
    this.loading = true;
    this.filters = filters;
    const params: IStringMap =
      filters && filters.length
        ? filters.reduce((obj, filter) => {
            return {
              ...obj,
              [FilterFieldParams[
                filter.field.value
              ]]: filter.value.value.toString(),
            };
          }, {})
        : [];
    this.entrylistservice
      .getAllEntries(this.route.snapshot.data.type, params)
      .subscribe((entries) => {
        this.entries = entries;
        this.loading = false;
      });
  }
}
