import { Component, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IEntry } from '../interfaces/entry.interface';

@Component({
  selector: 'app-entry-detail',
  templateUrl: './entry-detail.component.html',
  styleUrls: ['./entry-detail.component.css'],
  host: { class: 'flex-full-height' },
})
export class EntryDetailComponent implements OnInit {

  entry: IEntry;
  loading = true;

  constructor(
    private entryService: EntryService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.entryService.getEntry(this.activeRoute.snapshot.params.entryId)
      .subscribe((entry: IEntry) => {
        this.entry = entry;
        this.loading = false;
      });
  }

  deleteEntry() {
    this.entryService.deleteEntry(this.activeRoute.snapshot.params.entryId)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

}
