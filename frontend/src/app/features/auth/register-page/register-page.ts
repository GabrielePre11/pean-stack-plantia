import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Container } from '@/app/layout/container/container';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@/app/services/auth.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-register-page',
  imports: [Container, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private authService = inject(AuthService);

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);
  isSubmitted = signal<boolean>(false);
  isPasswordVisible = signal<boolean>(false);

  name = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10),
      Validators.pattern(/^[a-zA-Z\s]+$/),
    ],
  });
  email = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  password = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(8)],
  });

  getNameError(): string {
    const errors = this.name.errors;
    if (!errors) return '';

    if (errors['required']) return 'Name is required.';
    if (errors['minlength']) return 'Name must be at least 3 characters long.';
    if (errors['maxlength']) return 'Name must be at most 10 characters long.';
    if (errors['pattern']) return 'Name can only contain letters and spaces.';

    return 'Please insert a valid name.';
  }

  getEmailError(): string {
    if (this.email.errors?.['required']) {
      return 'Email is required.';
    }
    return 'Please insert a valid email.';
  }

  getPasswordError(): string {
    if (this.password.errors?.['required']) {
      return 'Password is required.';
    } else if (this.password.errors?.['minlength']) {
      return 'Password must be at least 8 characters long.';
    }
    return 'Please insert a valid password.';
  }

  togglePassword(e: Event) {
    e.preventDefault();
    this.isPasswordVisible.update((prev) => !prev);
  }

  onSubmit(e: Event) {
    e.preventDefault();

    this.isSubmitted.set(true);
    this.isLoading.set(true);
    this.errorState.set(null);

    if (this.name.invalid || this.email.invalid || this.password.invalid)
      return;

    this.authService
      .signUp({
        name: this.name.value,
        email: this.email.value,
        password: this.password.value,
      })
      .pipe(switchMap(() => this.authService.checkAuth()))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.errorState.set(null);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorState.set(err?.error?.message || 'Something went wrong.');
          console.error(err);
        },
      });
  }
}
