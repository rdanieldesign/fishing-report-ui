import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryDetailRoutingModule } from './entry-detail-routing.module';
import { EntryDetailComponent } from './entry-detail.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [EntryDetailComponent],
  imports: [
    CommonModule,
    EntryDetailRoutingModule,
    SharedModule,
  ]
})
export class EntryDetailModule { }
