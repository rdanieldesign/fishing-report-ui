import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryCreateRoutingModule } from './entry-create-routing.module';
import { EntryCreateComponent } from './entry-create.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [EntryCreateComponent],
  entryComponents: [EntryCreateComponent],
  imports: [
    CommonModule,
    EntryCreateRoutingModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class EntryCreateModule { }
