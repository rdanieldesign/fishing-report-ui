import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { LoginService } from './login.service';

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
    private readonly loginService: LoginService,
    private readonly router: Router,
  ) { }

  login() {
    this.loginService.login(this.loginForm.value)
      .pipe(
        tap(() => {
          this.loading = true;
        }),
        takeUntil(this.destroy$),
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
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
