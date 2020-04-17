import { Component, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';

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

}
