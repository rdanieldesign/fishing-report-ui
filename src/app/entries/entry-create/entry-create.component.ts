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

  entryForm = new FormControl('');

  constructor(
    private entryService: EntryService,
    private router: Router,
  ) { }

  createEntry() {
    this.entryService.createEntry(this.entryForm.value)
      .subscribe(() => this.router.navigate(['/entries']));
  }

}
