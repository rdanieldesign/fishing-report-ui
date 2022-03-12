import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from 'src/app/user/interfaces/user.interface';
import { environment } from 'src/environments/environment';
import { FriendStatus } from '../enums/friend-enum';
import { IFriendshipDetails } from '../interfaces/friends.interfaces';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FriendApiService {
  constructor(private readonly httpClient: HttpClient) {}

  private _friendRequestCount = new BehaviorSubject<number>(0);
  readonly friendRequestCount = this._friendRequestCount.asObservable();

  getAllFriends(): Observable<IFriendshipDetails[]> {
    return this.httpClient.get<IFriendshipDetails[]>(
      `${environment.apiDomain}/api/friends`
    );
  }

  getFriendRequests(): Observable<IFriendshipDetails[]> {
    return this.httpClient
      .get<IFriendshipDetails[]>(
        `${environment.apiDomain}/api/friends/requests`
      )
      .pipe(
        tap((requests) => {
          this._friendRequestCount.next(requests.length);
        })
      );
  }

  getPendingFriendRequests(): Observable<IFriendshipDetails[]> {
    return this.httpClient.get<IFriendshipDetails[]>(
      `${environment.apiDomain}/api/friends/pending`
    );
  }

  getFriendOptions(): Observable<IUser[]> {
    return this.httpClient.get<IUser[]>(
      `${environment.apiDomain}/api/friends/options`
    );
  }

  deleteFriendship(friendId: number): Observable<IFriendshipDetails[]> {
    return this.httpClient.put<IFriendshipDetails[]>(
      `${environment.apiDomain}/api/friends`,
      {
        userId: friendId,
        status: FriendStatus.Rejected,
      }
    );
  }

  requestFriendship(friendId: number): Observable<number> {
    return this.httpClient.post<number>(
      `${environment.apiDomain}/api/friends`,
      {
        userId: friendId,
        status: FriendStatus.Requested,
      }
    );
  }

  confirmFriendship(friendId: number): Observable<number> {
    return this.httpClient.put<number>(`${environment.apiDomain}/api/friends`, {
      userId: friendId,
      status: FriendStatus.Confirmed,
    });
  }
}
