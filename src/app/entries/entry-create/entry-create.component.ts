import { Component, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LocationAPIService } from '../../locations/services/location-api.service';
import { ILocation } from 'src/app/locations/interfaces/location.interface';
import { INewEntry } from '../interfaces/entry.interface';

@Component({
  selector: 'app-entry-create',
  templateUrl: './entry-create.component.html',
  styleUrls: ['./entry-create.component.css'],
  host: { class: 'flex-full-height centered-container' },
})
export class EntryCreateComponent implements OnInit {

  loading = true;
  entryForm = new FormGroup({
    notes: new FormControl('', [Validators.required]),
    locationId: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    catchCount: new FormControl(null, [Validators.required]),
  })
  locationOptions: ILocation[];

  constructor(
    private entryService: EntryService,
    private locationAPIService: LocationAPIService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.locationAPIService.getAllLocations()
      .subscribe((locations) => {
        this.locationOptions = locations;
        this.loading = false;
      });
  }

  createEntry() {
    const formValue: INewEntry = this.entryForm.value;
    this.entryService.createEntry({
      notes: formValue.notes,
      locationId: formValue.locationId,
      date: moment.utc(formValue.date).format("YYYY-MM-DD HH:mm:ss"),
      catchCount: formValue.catchCount,
    })
      .subscribe(() => this.router.navigate(['/entries']));
  }

}
