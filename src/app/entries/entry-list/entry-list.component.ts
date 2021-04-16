import { Component, OnDestroy, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';
import { concatMap, filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { ConfirmModalComponent } from 'src/app/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { UserService } from 'src/app/user/services/user.service';
import { IUser } from 'src/app/user/interfaces/user.interface';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css'],
  host: { class: 'flex-full-height centered-container' },
})
export class EntryListComponent implements OnInit, OnDestroy {

  entries = [];
  loading = true;
  currentUserId$: Observable<number | null> = this.userService.currentUser$
    .pipe(
      map((user: IUser | null): number | null => user ? user.id : null)
    );

  private destroy$ = new Subject();

  constructor(
    private readonly entrylistservice: EntryService,
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.entrylistservice.getAllEntries(this.route.snapshot.data.type)
      .subscribe((entries) => {
        this.entries = entries;
        this.loading = false;
      });
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
        concatMap(() => this.entrylistservice.getAllEntries(this.route.snapshot.data.type)),
        takeUntil(this.destroy$)
      )
      .subscribe((entries) => {
        this.entries = entries;
        this.loading = false;
      });
  }

  confirmDelete(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: { message: 'Are you sure you want to delete this report?' },
    });
    return dialogRef.afterClosed()
  }

}
