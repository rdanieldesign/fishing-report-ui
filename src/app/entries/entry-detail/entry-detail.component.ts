import { Component, OnDestroy, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IEntry } from '../interfaces/entry.interface';
import { concatMap, filter, take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-entry-detail',
  templateUrl: './entry-detail.component.html',
  styleUrls: ['./entry-detail.component.css'],
  host: { class: 'flex-full-height' },
})
export class EntryDetailComponent implements OnInit, OnDestroy {

  entry: IEntry;
  loading = true;

  private destroy$ = new Subject();

  constructor(
    private entryService: EntryService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.entryService.getEntry(this.activeRoute.snapshot.params.entryId)
      .subscribe((entry: IEntry) => {
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
        concatMap(() => this.entryService.deleteEntry(this.activeRoute.snapshot.params.entryId)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  confirmDelete(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: { message: 'Are you sure you want to delete this report?' },
    });
    return dialogRef.afterClosed()
  }

}
