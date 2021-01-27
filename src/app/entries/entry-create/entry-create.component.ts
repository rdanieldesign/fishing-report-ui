import { Component, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { LocationAPIService } from '../../locations/services/location-api.service';
import { ILocation } from 'src/app/locations/interfaces/location.interface';

@Component({
  selector: 'app-entry-create',
  templateUrl: './entry-create.component.html',
  styleUrls: ['./entry-create.component.css'],
  host: { class: 'flex-full-height centered-container' },
})
export class EntryCreateComponent implements OnInit {

  loading = true;
  notes = new FormControl('');
  location = new FormControl('');
  date = new FormControl('');
  catchCount = new FormControl(null);
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
    this.entryService.createEntry({
      notes: this.notes.value,
      locationId: this.location.value,
      date: moment.utc(this.date.value).format("YYYY-MM-DD HH:mm:ss"),
      catchCount: this.catchCount.value,
    })
      .subscribe(() => this.router.navigate(['/entries']));
  }

}
