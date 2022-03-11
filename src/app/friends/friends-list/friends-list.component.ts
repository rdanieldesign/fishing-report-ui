import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { concatMap, filter, take, takeUntil, tap } from 'rxjs/operators';
import { ConfirmModalComponent } from 'src/app/confirm-modal/confirm-modal.component';
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

  constructor(
    private readonly friendApiService: FriendApiService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.reloadFriendLists();
  }

  deleteFriendship(friendId: number, shouldConfirm = false) {
    this.confirmDelete(shouldConfirm)
      .pipe(
        take(1),
        filter(Boolean),
        concatMap(() => this.friendApiService.deleteFriendship(friendId)),
        takeUntil(this.destroy)
      )
      .subscribe(() => {
        this.reloadFriendLists();
      });
  }

  confirmDelete(shouldConfirm = false): Observable<boolean> {
    if (!shouldConfirm) return of(true);
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: { message: 'Are you sure you want to remove this friend?' },
    });
    return dialogRef.afterClosed();
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
