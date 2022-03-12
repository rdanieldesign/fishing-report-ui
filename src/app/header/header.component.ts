import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../notifications/notifications.service';
import { IUser } from '../user/interfaces/user.interface';
import { UserService } from '../user/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Output() toggleSideNav = new EventEmitter();

  currentUserName$: Observable<string> = this.userService.currentUser$.pipe(
    map((user: IUser | null): string => (user ? user.name : null))
  );

  hasNotifications: Observable<boolean> =
    this.notificationsService.hasNotifications;

  loggedIn = this.authService.authToken$.pipe(
    map((token) => {
      return Boolean(token);
    })
  );

  constructor(
    private readonly userService: UserService,
    private readonly notificationsService: NotificationsService,
    private readonly authService: AuthService
  ) {}

  toggleNav() {
    this.toggleSideNav.emit();
  }
}
