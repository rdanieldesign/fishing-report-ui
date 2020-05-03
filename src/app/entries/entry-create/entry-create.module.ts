import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryCreateRoutingModule } from './entry-create-routing.module';
import { EntryCreateComponent } from './entry-create.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [EntryCreateComponent],
  entryComponents: [EntryCreateComponent],
  imports: [
    CommonModule,
    EntryCreateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class EntryCreateModule { }
