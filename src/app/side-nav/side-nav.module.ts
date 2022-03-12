import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from './side-nav.component';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { NotificationIconModule } from '../notifications/notification-icon/notification-icon.module';

@NgModule({
  declarations: [SideNavComponent],
  imports: [
    CommonModule,
    MatDividerModule,
    RouterModule,
    NotificationIconModule,
  ],
  exports: [SideNavComponent],
})
export class SideNavModule {}
