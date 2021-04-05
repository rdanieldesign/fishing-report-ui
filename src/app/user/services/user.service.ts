import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from '../../../environments/environment';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly _currentUser$ = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.authService.authToken$
    .pipe(
      switchMap((authToken: string) => {
        return authToken ? this.getCurrentUser() : this.clearCurrentUser();
      })
    );

  constructor(
    private readonly httpClient: HttpClient,
    private readonly authService: AuthService,
  ) { }

  getCurrentUser() {
    if (this._currentUser$.value) {
      return this._currentUser$.asObservable();
    } else {
      return this.fetchCurrentUser();
    }
  }

  clearCurrentUser(): Observable<IUser | null> {
    this._currentUser$.next(null);
    return this._currentUser$.asObservable();
  }

  private fetchCurrentUser(): Observable<IUser> {
    return this.httpClient.get<IUser>(`${environment.apiDomain}/api/users/current`)
      .pipe(
        tap((user: IUser) => this._currentUser$.next(user)),
        shareReplay(1),
      );
  }
}
