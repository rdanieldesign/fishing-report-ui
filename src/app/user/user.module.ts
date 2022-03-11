import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntriesRoutingModule } from '../entries/entries-routing.module';
import { EntryListViewService } from '../entries/entry-list/entry-list-view.service';
import { UserViewService } from './user-view.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, EntriesRoutingModule],
  providers: [
    {
      provide: EntryListViewService,
      useClass: UserViewService,
    },
  ],
})
export class UserModule {}
