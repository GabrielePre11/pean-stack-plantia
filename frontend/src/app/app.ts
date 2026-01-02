import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@/app/core/header/header';
import { AuthService } from '@/app/services/auth.service';
import { Footer } from './core/footer/footer';
import { WishlistService } from './services/wishlist.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private authService = inject(AuthService);
  private wishlistService = inject(WishlistService);
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

        /**
         * @ Subscribing to getUserWishlist() to check if the user has any items in the wishlist,
         * and synchronize the items with the wishlistItems signal.
         */
        this.wishlistService.getUserWishlist().subscribe({
          next: () => {
            this.isLoading.set(false);
            this.errorState.set(null);
          },
          error: (err) => {
            this.isLoading.set(false);
            this.errorState.set(err?.error?.message || 'Something went wrong.');
          },
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorState.set(err?.error?.message || 'Something went wrong.');
      },
    });
  }
}
