import { Component, inject, OnInit, signal } from '@angular/core';
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
export class App implements OnInit {
  private authService = inject(AuthService);
  protected title = 'frontend';

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);
  user = this.authService.user;

  ngOnInit(): void {
    this.isLoading.set(true);

    this.authService.checkAuth().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorState.set(err?.error?.message || 'Something went wrong.');
      },
    });
  }
}
