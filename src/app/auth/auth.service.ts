import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ICredentials, INewUser } from './auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken$: Observable<string | null>;
  private readonly authStorageKey = 'authToken';
  private readonly _authToken$: BehaviorSubject<string | null>;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
  ) {
    let token: string | null;
    try {
      token = JSON.parse(localStorage.getItem(this.authStorageKey));
    } catch (err) {
      token = null;
    }
    this._authToken$ = new BehaviorSubject(token);
    this.authToken$ = this._authToken$.asObservable();
  }

  login(credentials: ICredentials): Observable<string> {
    return this.httpClient.post<string>(`${environment.apiDomain}/api/auth/login`, credentials)
      .pipe(
        tap((token: string) => {
          this.setTokenValue(token);
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackBar.open(err.error);
          return throwError(err);
        }),
      );
  }

  logout() {
    this.setTokenValue(null);
    this.router.navigate(['/login']);
  }

  signup(newUser: INewUser): Observable<string> {
    return this.httpClient.post<string>(`${environment.apiDomain}/api/auth/signup`, newUser)
      .pipe(
        tap((token: string) => {
          this.setTokenValue(token);
        }),
      );
  }

  getAuthToken(): string | null {
    return this._authToken$.value;
  }

  private setTokenValue(token: string | null) {
    this._authToken$.next(token);
    localStorage.setItem(this.authStorageKey, JSON.stringify(token));
  }
  
}
