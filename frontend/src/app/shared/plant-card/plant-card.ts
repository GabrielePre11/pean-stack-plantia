import { Plant } from '@/app/models/types/plant.type';
import { AuthService } from '@/app/services/auth.service';
import { CartService } from '@/app/services/cart.service';
import { WishlistService } from '@/app/services/wishlist.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';

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

  readonly plant = input.required<Plant>();
  user = this.authService.user;

  // Reviews Limit
  reviews = Array.from({ length: 5 });

  toggleWishlist(plant: Plant) {
    this.wishlistService.toggleWishlist(plant).subscribe();
  }

  isAlreadyInWishlist(slug: string) {
    return this.wishlistService.isAlreadyInWishlist(slug);
  }

  addToCart(plant: Plant) {
    this.cartService.addToCart(plant).subscribe();
  }
}
