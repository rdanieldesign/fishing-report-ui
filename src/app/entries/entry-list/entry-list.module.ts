import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryListRoutingModule } from './entry-list-routing.module';
import { EntryListComponent } from './entry-list.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [EntryListComponent],
  imports: [
    CommonModule,
    EntryListRoutingModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class EntryListModule { }
