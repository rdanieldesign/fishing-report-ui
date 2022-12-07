import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryEditRoutingModule } from './entry-edit-routing.module';
import { EntryEditComponent } from './entry-edit.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormModule } from 'src/app/shared/form/form.module';
import { LocationCreateModule } from 'src/app/locations/location-create/location-create.module';
import { FileUploadModule } from 'src/app/shared/file-upload/file-upload.module';

@NgModule({
  declarations: [EntryEditComponent],
  entryComponents: [EntryEditComponent],
  imports: [
    CommonModule,
    EntryEditRoutingModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    SharedModule,
    FormModule,
    LocationCreateModule,
    FileUploadModule,
  ],
})
export class EntryEditModule {}
