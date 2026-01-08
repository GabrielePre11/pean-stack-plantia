import { Plant } from '@/app/models/types/plant.type';
import { AuthService } from '@/app/services/auth.service';
import { CartService } from '@/app/services/cart.service';
import { WishlistService } from '@/app/services/wishlist.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-plant-card',
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './plant-card.html',
  styleUrl: './plant-card.css',
})
export class PlantCard {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  readonly plant = input.required<Plant>();
  user = this.authService.user;

  // Reviews Limit
  reviews = Array.from({ length: 5 });

  isAlreadyInWishlist(slug: string) {
    return this.wishlistService.isAlreadyInWishlist(slug);
  }

  addToCart(plant: Plant) {
    if (!this.authService.user()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Not Logged In',
        detail: 'You need to be logged in to manage your cart.',
      });
      return;
    }

    this.cartService.addToCart(plant).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Added to Cart',
          detail: `${plant.name} has been added to your cart.`,
        });
      },
    });
  }

  toggleWishlist(plant: Plant) {
    if (!this.authService.user()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Not Logged In',
        detail: 'You need to be logged in to manage your wishlist.',
      });
      return;
    }

    // So that the value is checked before the toggle
    const alreadyInWishlist = this.isAlreadyInWishlist(plant.slug);

    this.wishlistService.toggleWishlist(plant).subscribe({
      next: () => {
        this.messageService.add({
          severity: alreadyInWishlist ? 'info' : 'success',
          summary: alreadyInWishlist
            ? 'Removed from Wishlist'
            : 'Added to Wishlist',
          detail: alreadyInWishlist
            ? `${plant.name} has been removed from your wishlist.`
            : `${plant.name} has been added to your wishlist.`,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            err.message || 'An error occurred while updating your wishlist.',
        });
      },
    });
  }
}
