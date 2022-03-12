import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NotificationIconModule } from '../notifications/notification-icon/notification-icon.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    RouterModule,
    SharedModule,
    NotificationIconModule,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}
