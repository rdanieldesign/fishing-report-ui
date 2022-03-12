import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { FriendApiService } from '../friends/services/friend-api.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(
    private readonly authService: AuthService,
    private readonly friendService: FriendApiService
  ) {
    this.authService.authToken$.subscribe((token) => {
      if (token) {
        this.setFriendRequestCount();
      }
    });
  }

  hasNotifications: Observable<boolean> = combineLatest([
    this.authService.authToken$,
    this.friendService.friendRequestCount,
  ]).pipe(
    map(([token, friendRequestCount]) => {
      return token ? Boolean(friendRequestCount) : false;
    })
  );

  setFriendRequestCount() {
    this.friendService.getFriendRequests().subscribe();
  }
}
