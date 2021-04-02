import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser$: Observable<IUser>;

  constructor(private httpClient: HttpClient) {
    this.currentUser$ = this.httpClient.get<IUser>(`${environment.apiDomain}/api/users/current`)
      .pipe(shareReplay(1));
  }
}
