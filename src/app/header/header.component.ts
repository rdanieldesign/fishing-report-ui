import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { IUser } from '../user/interfaces/user.interface';
import { UserService } from '../user/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  currentUserName$: Observable<string> = this.userService.currentUser$
    .pipe(
      map((user: IUser | null): string => user ? user.name : null)
    );

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  logout() {
    this.authService.logout();
  }

}
