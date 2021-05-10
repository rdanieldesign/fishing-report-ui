import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryListRoutingModule } from './entry-list-routing.module';
import { EntryListComponent } from './entry-list.component';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmModalModule } from 'src/app/confirm-modal/confirm-modal.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilterModule } from '../filter/filter.module';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [EntryListComponent],
  imports: [
    CommonModule,
    EntryListRoutingModule,
    MatListModule,
    SharedModule,
    ConfirmModalModule,
    MatToolbarModule,
    FilterModule,
    MatExpansionModule,
  ],
})
export class EntryListModule {}
