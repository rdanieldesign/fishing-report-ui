import { Component, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries = [];

  constructor(
    private entrylistservice: EntryService
  ) { }

  ngOnInit(): void {
    this.entrylistservice.getAllEntries()
      .subscribe((entries) => {
        this.entries = entries;
      })
  }

  deleteEntry(id: string) {
    this.entrylistservice.deleteEntry(id)
      .pipe(
        concatMap(() => this.entrylistservice.getAllEntries())
      )
      .subscribe((entries) => {
        this.entries = entries;
      })
  }

}
