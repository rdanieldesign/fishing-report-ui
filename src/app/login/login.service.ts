import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ICredentials } from './login.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private httpClient: HttpClient
  ) { }

  login(credentials: ICredentials): Observable<string> {
    return this.httpClient.post<string>(`${environment.apiDomain}/api/auth/login`, credentials)
      .pipe(
        tap((token: string) => {
          localStorage.setItem('authToken', token);
        })
      );
  }
}
