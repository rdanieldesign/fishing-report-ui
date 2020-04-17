import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'entries',
    pathMatch: 'full',
  },
  {
    path: 'entries',
    loadChildren: () => import('./entries/entries.module').then(m => m.EntriesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
