import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  openSideNav = false;

  constructor(private readonly router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.openSideNav) {
        this.openSideNav = false;
      }
    });
  }

  toggleSideNav() {
    this.openSideNav = !this.openSideNav;
  }
}
