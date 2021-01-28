import { Component, OnDestroy, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';
import { concatMap, filter, take, takeUntil, tap } from 'rxjs/operators';
import { ConfirmModalComponent } from 'src/app/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css'],
  host: { class: 'flex-full-height centered-container' },
})
export class EntryListComponent implements OnInit, OnDestroy {

  entries = [];
  loading = true;

  private destroy$ = new Subject();

  constructor(
    private entrylistservice: EntryService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.entrylistservice.getAllEntries()
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
        concatMap(() => this.entrylistservice.getAllEntries()),
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
