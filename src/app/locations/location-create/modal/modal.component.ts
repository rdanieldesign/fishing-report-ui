import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ILocation } from '../../interfaces/location.interface';
import { LocationCreateComponent } from '../location-create.component';

@Component({
  selector: 'app-location-create-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class LocationCreateModalComponent {
  constructor(public dialogRef: MatDialogRef<LocationCreateComponent>) {}

  confirm(locationId: number) {
    this.dialogRef.close(locationId);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
