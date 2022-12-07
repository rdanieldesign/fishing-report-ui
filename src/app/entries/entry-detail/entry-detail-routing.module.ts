import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntryDetailComponent } from './entry-detail.component';

const routes: Routes = [
  {
    path: '',
    component: EntryDetailComponent,
  },
  {
    path: 'edit',
    loadChildren: () =>
      import('../entry-edit/entry-edit.module').then((m) => m.EntryEditModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntryDetailRoutingModule {}
