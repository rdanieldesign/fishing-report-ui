import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntryTypes } from './entries/entry.enum';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule)
  },
  {
    path: 'all-entries',
    data: { type: EntryTypes.All },
    loadChildren: () => import('./entries/entries.module').then(m => m.EntriesModule)
  },
  {
    path: 'my-entries',
    data: { type: EntryTypes.Mine },
    loadChildren: () => import('./entries/entries.module').then(m => m.EntriesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
