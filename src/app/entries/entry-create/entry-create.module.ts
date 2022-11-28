import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryCreateRoutingModule } from './entry-create-routing.module';
import { EntryCreateComponent } from './entry-create.component';
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
  declarations: [EntryCreateComponent],
  entryComponents: [EntryCreateComponent],
  imports: [
    CommonModule,
    EntryCreateRoutingModule,
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
export class EntryCreateModule {}
