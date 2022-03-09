import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendsAddComponent } from './friends-add/friends-add.component';
import { FriendsListComponent } from './friends-list/friends-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: FriendsListComponent,
  },
  {
    path: 'add',
    component: FriendsAddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsRoutingModule {}
