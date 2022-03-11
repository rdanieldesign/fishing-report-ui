import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./signup/signup.module').then((m) => m.SignupModule),
  },
  {
    path: 'all-entries',
    loadChildren: () =>
      import('./entries/entries.module').then((m) => m.EntriesModule),
  },
  {
    path: 'my-entries',
    loadChildren: () =>
      import('./my-entries/my-entries.module').then((m) => m.MyEntriesModule),
  },
  {
    path: 'entries/:userId',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'friends',
    loadChildren: () =>
      import('./friends/friends.module').then((m) => m.FriendsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
