import { Component, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LocationAPIService } from '../../locations/services/location-api.service';
import { ILocation } from 'src/app/locations/interfaces/location.interface';
import { INewEntry } from '../interfaces/entry.interface';
import { MatDialog } from '@angular/material/dialog';
import { LocationCreateModalComponent } from 'src/app/locations/location-create/modal/modal.component';
import { filter } from 'rxjs/operators';

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
    images: new FormControl(null),
  });
  locationOptions: ILocation[];

  constructor(
    private entryService: EntryService,
    private locationAPIService: LocationAPIService,
    private router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchLocations();
  }

  createEntry() {
    const formValue: INewEntry = this.entryForm.value;
    const formData = new FormData();
    Object.keys(formValue).forEach((key: string) => {
      if (key === 'date') {
        formData.append(
          key,
          moment.utc(formValue[key]).format('YYYY-MM-DD HH:mm:ss')
        );
      } else if (key === 'images') {
        for (let i = 0; i < formValue.images.length; i++) {
          formData.append('images', formValue.images.item(i));
        }
      } else {
        formData.append(key, formValue[key]);
      }
    });
    this.entryService
      .createEntry(formData)
      .subscribe(() =>
        this.router.navigate(['../'], { relativeTo: this.route })
      );
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  addNewLocation(event) {
    event.preventDefault();
    this.dialog
      .open(LocationCreateModalComponent)
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((locationId: number | null) => {
        this.fetchLocations();
        this.entryForm.patchValue({ locationId });
      });
  }

  private fetchLocations() {
    this.loading = true;
    this.locationAPIService.getAllLocations().subscribe((locations) => {
      this.locationOptions = locations;
      this.loading = false;
    });
  }
}
