import { Component, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IFriendshipDetails } from '../interfaces/friends.interfaces';
import { FriendApiService } from '../services/friend-api.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css'],
  host: { class: 'flex-full-height centered-container' },
})
export class FriendsListComponent implements OnInit {
  friends: IFriendshipDetails[] = [];
  requests: IFriendshipDetails[] = [];
  pending: IFriendshipDetails[] = [];
  loading = true;
  private readonly destroy = new Subject();

  constructor(private readonly friendApiService: FriendApiService) {}

  ngOnInit(): void {
    this.reloadFriendLists();
  }

  deleteFriendship(friendId: number) {
    this.friendApiService
      .deleteFriendship(friendId)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.reloadFriendLists();
      });
  }

  confirmFriendship(friendId: number) {
    this.friendApiService
      .confirmFriendship(friendId)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.reloadFriendLists();
      });
  }

  private reloadFriendLists() {
    this.loading = true;
    combineLatest([
      this.friendApiService.getAllFriends(),
      this.friendApiService.getFriendRequests(),
      this.friendApiService.getPendingFriendRequests(),
    ])
      .pipe(takeUntil(this.destroy))
      .subscribe(([friends, requests, pending]) => {
        this.friends = friends;
        this.requests = requests;
        this.pending = pending;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
