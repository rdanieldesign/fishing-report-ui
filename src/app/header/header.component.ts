import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FriendApiService } from '../friends/services/friend-api.service';
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

  constructor(
    private readonly userService: UserService,
    private readonly notificationsService: NotificationsService
  ) {}

  toggleNav() {
    this.toggleSideNav.emit();
  }
}
