import { Component } from '@angular/core';
import { EntryService } from '../entry.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-entry-create',
  templateUrl: './entry-create.component.html',
  styleUrls: ['./entry-create.component.css']
})
export class EntryCreateComponent {

  narrative = new FormControl('');
  location = new FormControl('');
  date = new FormControl('');

  constructor(
    private entryService: EntryService,
    private router: Router,
  ) { }

  createEntry() {
    this.entryService.createEntry({
      narrative: this.narrative.value,
      location: this.location.value,
      date: this.date.value,
    })
      .subscribe(() => this.router.navigate(['/entries']));
  }

}
