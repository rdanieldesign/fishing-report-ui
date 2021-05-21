import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ILocation, INewLocation } from '../interfaces/location.interface';
import { LocationAPIService } from '../services/location-api.service';

@Component({
  selector: 'app-location-create',
  templateUrl: './location-create.component.html',
  styleUrls: ['./location-create.component.css'],
})
export class LocationCreateComponent implements OnInit {
  @Output() onLocationCreated = new EventEmitter<number>();
  @Output() onCancel = new EventEmitter();
  constructor(private readonly locationAPIService: LocationAPIService) {}

  loading = false;
  locationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    googleMapsLink: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {}

  createLocation() {
    this.loading = true;
    const formValue: INewLocation = this.locationForm.value;
    this.locationAPIService
      .createLocation(formValue)
      .subscribe((locationId) => {
        this.loading = false;
        this.onLocationCreated.emit(locationId);
      });
  }

  cancel() {
    this.onCancel.emit();
  }
}
