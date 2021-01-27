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
  ]
})
export class EntryCreateModule { }
