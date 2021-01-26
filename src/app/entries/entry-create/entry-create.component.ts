import { Component } from '@angular/core';
import { EntryService } from '../entry.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-entry-create',
  templateUrl: './entry-create.component.html',
  styleUrls: ['./entry-create.component.css'],
  host: { class: 'flex-full-height centered-container' },
})
export class EntryCreateComponent {

  notes = new FormControl('');
  location = new FormControl('');
  date = new FormControl('');

  constructor(
    private entryService: EntryService,
    private router: Router,
  ) { }

  createEntry() {
    this.entryService.createEntry({
      notes: this.notes.value,
      locationId: 1,
      date: this.date.value,
      catchCount: 0,
    })
      .subscribe(() => this.router.navigate(['/entries']));
  }

}
