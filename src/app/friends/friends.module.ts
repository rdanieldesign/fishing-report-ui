import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendsRoutingModule } from './friends-routing.module';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { SharedModule } from '../shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FriendsAddComponent } from './friends-add/friends-add.component';

@NgModule({
  declarations: [FriendsListComponent, FriendsAddComponent],
  imports: [
    CommonModule,
    FriendsRoutingModule,
    SharedModule,
    MatDividerModule,
    MatTabsModule,
    MatAutocompleteModule,
  ],
})
export class FriendsModule {}
