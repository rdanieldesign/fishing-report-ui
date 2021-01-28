import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryListRoutingModule } from './entry-list-routing.module';
import { EntryListComponent } from './entry-list.component';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmModalModule } from 'src/app/confirm-modal/confirm-modal.module';

@NgModule({
  declarations: [EntryListComponent],
  imports: [
    CommonModule,
    EntryListRoutingModule,
    MatListModule,
    SharedModule,
    ConfirmModalModule,
  ]
})
export class EntryListModule { }
