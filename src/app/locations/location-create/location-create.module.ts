import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationCreateComponent } from './location-create.component';
import { FormModule } from 'src/app/shared/form/form.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationCreateModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [LocationCreateComponent, LocationCreateModalComponent],
  imports: [
    CommonModule,
    FormModule,
    MatFormFieldModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [LocationCreateComponent, LocationCreateModalComponent],
  entryComponents: [LocationCreateModalComponent, LocationCreateComponent],
})
export class LocationCreateModule {}
