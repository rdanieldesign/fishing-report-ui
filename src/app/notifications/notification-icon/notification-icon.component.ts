import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-icon',
  templateUrl: './notification-icon.component.html',
  styleUrls: ['./notification-icon.component.css'],
})
export class NotificationIconComponent {
  @Input() left = '1.5rem';
  @Input() top = '.5rem';
  @Input() hasNotifications = false;
}
