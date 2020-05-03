import { Component, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css'],
  host: { class: 'flex-full-height centered-container' },
})
export class EntryListComponent implements OnInit {

  entries = [];
  loading = true;

  constructor(
    private entrylistservice: EntryService
  ) { }

  ngOnInit(): void {
    this.entrylistservice.getAllEntries()
      .subscribe((entries) => {
        this.entries = entries;
        this.loading = false;
      });
  }

  deleteEntry(id: string) {
    this.loading = true;
    this.entrylistservice.deleteEntry(id)
      .pipe(
        concatMap(() => this.entrylistservice.getAllEntries())
      )
      .subscribe((entries) => {
        this.entries = entries;
        this.loading = false;
      });
  }

}
