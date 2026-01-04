import { Component, effect, inject, signal } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '@/app/services/wishlist.service';
import { PlantCard } from '@/app/shared/plant-card/plant-card';
import { AuthService } from '@/app/services/auth.service';
import { CardSkeletonCard } from '@/app/shared/card-skeleton-card/card-skeleton-card';

@Component({
  selector: 'app-wishlist',
  imports: [Container, CommonModule, RouterModule, PlantCard, CardSkeletonCard],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist {
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);

  wishlistItems = this.wishlistService.wishlistItems;
  user = this.authService.user;

  constructor() {
    effect(() => {
      this.isLoading.set(true);
      this.errorState.set(null);
      this.getUserWishlist();
    });
  }

  getUserWishlist() {
    return this.wishlistService.getUserWishlist().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.errorState.set(null);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorState.set(err?.error?.message || 'Something went wrong');
      },
    });
  }
}
