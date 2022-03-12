import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../notifications/notifications.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly notificationsService: NotificationsService
  ) {}

  hasNotifications = this.notificationsService.hasNotifications;

  logout() {
    this.authService.logout();
  }
}
