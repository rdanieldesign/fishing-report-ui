import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  host: { class: 'flex-full-height centered-container' },
})
export class SignupComponent implements OnDestroy {

  loading = false;
  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    passwordAgain: new FormControl('', [Validators.required]),
  }, { validators: this.validatePasswords });

  private destroy$ = new Subject();

  constructor(
    private readonly signupService: SignupService,
    private readonly router: Router,
  ) { }

  signup() {
    this.signupService.signup(this.signupForm.value)
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
          this.signupForm.reset();
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private validatePasswords(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password').value;
    const passwordAgain = control.get('passwordAgain').value;
    return password === passwordAgain ? null : { passwordsDontMatch: true };
  }

}
