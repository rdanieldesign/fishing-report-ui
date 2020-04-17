import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntriesComponent } from './entries.component';


const routes: Routes = [
  {
    path: '',
    component: EntriesComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./entry-list/entry-list.module').then(m => m.EntryListModule)
      },
      {
        path: 'create',
        loadChildren: () => import('./entry-create/entry-create.module').then(m => m.EntryCreateModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntriesRoutingModule { }
