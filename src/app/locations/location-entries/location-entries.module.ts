import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntriesRoutingModule } from 'src/app/entries/entries-routing.module';
import { EntryListViewService } from 'src/app/entries/entry-list/entry-list-view.service';
import { LocationEntriesViewService } from './location-entries-view.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, EntriesRoutingModule],
  providers: [
    {
      provide: EntryListViewService,
      useClass: LocationEntriesViewService,
    },
  ],
})
export class LocationEntriesModule {}
