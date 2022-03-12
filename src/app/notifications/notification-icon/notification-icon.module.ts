import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationIconComponent } from './notification-icon.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [NotificationIconComponent],
  imports: [CommonModule, SharedModule],
  exports: [NotificationIconComponent],
})
export class NotificationIconModule {}
