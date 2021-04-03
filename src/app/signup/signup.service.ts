import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { INewUser } from './signup.interface';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(
    private httpClient: HttpClient
  ) { }

  signup(newUser: INewUser): Observable<string> {
    return this.httpClient.post<string>(`${environment.apiDomain}/api/auth/signup`, newUser)
      .pipe(
        tap((token: string) => {
          localStorage.setItem('authToken', token);
        })
      );
  }
}
