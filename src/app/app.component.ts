import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  openSideNav = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    combineLatest([this.authService.authToken$, this.router.events]).subscribe(
      ([token, routerEvent]) => {
        if (!token) {
          this.openSideNav = false;
          return;
        }
        if (routerEvent instanceof NavigationEnd && this.openSideNav) {
          this.openSideNav = false;
        }
      }
    );
  }

  toggleSideNav() {
    this.openSideNav = !this.openSideNav;
  }
}
