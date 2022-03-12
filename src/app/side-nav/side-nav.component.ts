import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../notifications/notifications.service';
import { IUser } from '../user/interfaces/user.interface';
import { UserService } from '../user/services/user.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly notificationsService: NotificationsService
  ) {}

  currentUserName$: Observable<string> = this.userService.currentUser$.pipe(
    map((user: IUser | null): string => (user ? user.name : null))
  );

  hasNotifications = this.notificationsService.hasNotifications;

  logout() {
    this.authService.logout();
  }
}
