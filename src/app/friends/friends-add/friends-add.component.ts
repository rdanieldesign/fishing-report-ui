import { Component, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { IUser } from 'src/app/user/interfaces/user.interface';
import { FriendApiService } from '../services/friend-api.service';

@Component({
  selector: 'app-friends-add',
  templateUrl: './friends-add.component.html',
  styleUrls: ['./friends-add.component.css'],
  host: { class: 'flex-full-height centered-container' },
})
export class FriendsAddComponent implements OnInit {
  loading = true;
  friendOptions: IUser[] = [];
  private readonly destroy = new Subject();
  constructor(private readonly friendApiService: FriendApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.friendApiService
      .getFriendOptions()
      .pipe(takeUntil(this.destroy))
      .subscribe((options) => {
        this.friendOptions = options;
        this.loading = false;
      });
  }

  requestFriendship(id: number) {
    this.loading = true;
    this.friendApiService
      .requestFriendship(id)
      .pipe(
        switchMap(() => this.friendApiService.getFriendOptions()),
        takeUntil(this.destroy)
      )
      .subscribe((options) => {
        this.friendOptions = options;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
