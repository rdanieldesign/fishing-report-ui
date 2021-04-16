import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from './side-nav.component';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [SideNavComponent],
  imports: [
    CommonModule,
    MatDividerModule,
    RouterModule,
  ],
  exports: [SideNavComponent]
})
export class SideNavModule { }
