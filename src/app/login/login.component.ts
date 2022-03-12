import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  host: { class: 'flex-full-height centered-container' },
})
export class LoginComponent implements OnDestroy {
  loading = false;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  private destroy$ = new Subject();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  login() {
    this.authService
      .login(this.loginForm.value)
      .pipe(
        tap(() => {
          this.loading = true;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/entries']);
        },
        error: () => {
          this.loginForm.reset();
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
