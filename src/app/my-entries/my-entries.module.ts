import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryListViewService } from '../entries/entry-list/entry-list-view.service';
import { MyEntryListViewService } from './my-entry-list-view.service';
import { EntriesRoutingModule } from '../entries/entries-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, EntriesRoutingModule],
  providers: [
    {
      provide: EntryListViewService,
      useClass: MyEntryListViewService,
    },
  ],
})
export class MyEntriesModule {}
