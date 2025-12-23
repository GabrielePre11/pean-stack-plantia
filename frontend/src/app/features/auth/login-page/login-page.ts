import { Component, inject, signal } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [Container, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);
  isPasswordVisible = signal<boolean>(false);

  email = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  password = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(8)],
  });

  togglePassword(e: Event) {
    e.preventDefault();
    this.isPasswordVisible.update((prev) => !prev);
  }

  onSubmit(e: Event) {
    e.preventDefault();
    this.isLoading.set(true);
    this.errorState.set(null);

    this.authService
      .signIn({
        email: this.email.value,
        password: this.password.value,
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorState.set(err?.error?.message || 'Something went wrong.');
          console.error(err);
        },
      });
  }
}
