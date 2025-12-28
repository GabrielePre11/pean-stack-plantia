import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@/app/core/header/header';
import { AuthService } from '@/app/services/auth.service';
import { Footer } from './core/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private authService = inject(AuthService);
  protected title = 'frontend';

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);
  user = this.authService.user;

  constructor() {
    effect(() => {
      this.isLoading.set(true);
      this.errorState.set(null);
      this.checkAuth();
    });
  }

  checkAuth() {
    return this.authService.checkAuth().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.errorState.set(null);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorState.set(err?.error?.message || 'Something went wrong.');
      },
    });
  }
}
