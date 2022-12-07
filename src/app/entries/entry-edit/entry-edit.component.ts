import { Component, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LocationAPIService } from '../../locations/services/location-api.service';
import { ILocation } from 'src/app/locations/interfaces/location.interface';
import { IEntry, INewEntry } from '../interfaces/entry.interface';
import { MatDialog } from '@angular/material/dialog';
import { LocationCreateModalComponent } from 'src/app/locations/location-create/modal/modal.component';
import { filter, tap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-entry-edit',
  templateUrl: './entry-edit.component.html',
  styleUrls: ['./entry-edit.component.css'],
  host: { class: 'flex-full-height centered-container' },
})
export class EntryEditComponent implements OnInit {
  loading = true;
  entryForm: FormGroup;
  locationOptions: ILocation[];
  entry: IEntry;

  constructor(
    private entryService: EntryService,
    private locationAPIService: LocationAPIService,
    private router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;
    forkJoin([
      this.fetchLocations(),
      this.entryService.getEntry(this.activeRoute.snapshot.params.entryId),
    ]).subscribe(([_, entry]) => {
      this.entry = entry;
      this.entryForm = new FormGroup({
        notes: new FormControl(entry.notes, [Validators.required]),
        locationId: new FormControl(entry.locationId, [Validators.required]),
        date: new FormControl(entry.date, [Validators.required]),
        catchCount: new FormControl(entry.catchCount, [Validators.required]),
        images: new FormControl(entry.images),
      });
      this.loading = false;
    });
  }

  createEntry() {
    const formValue = this.entryForm.value;
    const formData = new FormData();
    Object.keys(formValue).forEach((key: string) => {
      if (key === 'date') {
        formData.append(
          key,
          moment.utc(formValue[key]).format('YYYY-MM-DD HH:mm:ss')
        );
      } else if (key === 'images') {
        let imageNames = [];
        formValue.images.forEach((image) => {
          if (image.newFile) {
            formData.append('images', image.newFile);
            imageNames.push(image.newFile.name);
          } else {
            imageNames.push(image.imageId);
          }
        });
        formData.append('imageIds', JSON.stringify(imageNames));
      } else {
        formData.append(key, formValue[key]);
      }
    });
    this.entryService
      .editEntry(this.entry.id, formData)
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

  private fetchLocations(): Observable<ILocation[]> {
    return this.locationAPIService.getAllLocations().pipe(
      tap((locations) => {
        this.locationOptions = locations;
      })
    );
  }
}
