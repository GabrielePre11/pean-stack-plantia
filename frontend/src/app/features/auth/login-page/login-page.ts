import { Component, inject, signal } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@/app/services/auth.service';
import { switchMap } from 'rxjs';

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
  isSubmitted = signal<boolean>(false);
  isPasswordVisible = signal<boolean>(false);

  email = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  password = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(8)],
  });

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

  /**
   * @ switchMap è un operatore di RxJS che permette di trasformare un Observable in un altro Observable,
   * @ concatenando le chiamate in maniera pulita senza dover annidare subscribe().
   *
   * @ In questo caso:
   * @ 1. signIn() ritorna un Observable della chiamata POST per fare il login.
   * @ 2. switchMap intercetta la risposta del login e lancia checkAuth(), un altro Observable che
   * @    recupera i dati completi dell'utente e aggiorna lo stato globale tramite tap().
   * @ 3. Il flusso che arriva al subscribe finale è solo quello di checkAuth(), quindi il componente
   *      può reagire (es. navigare) senza preoccuparsi di aggiornare lo stato utente.
   *
   * @ In Angular, gli HttpClient restituiscono sempre Observables, non Promises.
   * @ Gli Observables sono lazy: la richiesta parte solo quando qualcuno fa subscribe().
   * @ Con RxJS puoi trasformarli, concatenarli o gestire effetti collaterali (tap, map, switchMap…)
   *
   * - fonte: ChatGPT
   */

  onSubmit(e: Event) {
    e.preventDefault();
    this.isSubmitted.set(true);
    this.isLoading.set(true);
    this.errorState.set(null);

    if (this.email.invalid || this.password.invalid) return;

    this.isLoading.set(true);
    this.errorState.set(null);

    this.authService
      .signIn({
        email: this.email.value,
        password: this.password.value,
      })
      .pipe(switchMap(() => this.authService.checkAuth()))
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
