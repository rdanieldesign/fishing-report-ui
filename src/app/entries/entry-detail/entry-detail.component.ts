import { Component, OnDestroy, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IEntry } from '../interfaces/entry.interface';
import { concatMap, filter, map, take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/user/services/user.service';
import { IUser } from 'src/app/user/interfaces/user.interface';

@Component({
  selector: 'app-entry-detail',
  templateUrl: './entry-detail.component.html',
  styleUrls: ['./entry-detail.component.css'],
  host: { class: 'flex-full-height' },
})
export class EntryDetailComponent implements OnInit, OnDestroy {
  entry: IEntry;
  loading = true;
  currentUserId$: Observable<number | null> =
    this.userService.currentUser$.pipe(
      map((user: IUser | null): number => (user ? user.id : null))
    );

  private destroy$ = new Subject();

  constructor(
    private readonly entryService: EntryService,
    private readonly activeRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.entryService
      .getEntry(this.activeRoute.snapshot.params.entryId)
      .subscribe((entry: IEntry) => {
        if (!entry) {
          this.router.navigate(['../'], { relativeTo: this.route });
          return;
        }
        this.entry = entry;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteEntry() {
    this.confirmDelete()
      .pipe(
        take(1),
        filter(Boolean),
        concatMap(() =>
          this.entryService.deleteEntry(
            this.activeRoute.snapshot.params.entryId
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }

  confirmDelete(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: { message: 'Are you sure you want to delete this report?' },
    });
    return dialogRef.afterClosed();
  }

  editEntry() {
    this.router.navigate([`./edit`], {
      relativeTo: this.route,
    });
  }
}
