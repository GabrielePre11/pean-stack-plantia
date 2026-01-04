import { Plant } from '@/app/models/types/plant.type';
import { CartService } from '@/app/services/cart.service';
import { WishlistService } from '@/app/services/wishlist.service';
import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';

@Component({
  selector: 'app-cart-wishlist-item-card',
  imports: [CommonModule],
  templateUrl: './cart-wishlist-item-card.html',
  styleUrl: './cart-wishlist-item-card.css',
})
export class CartWishlistItemCard {
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  plant = input.required<Plant>();

  addToCart(plant: Plant) {
    this.cartService.addToCart(plant).subscribe();
  }

  removeFromWishlist(plant: Plant) {
    this.wishlistService.toggleWishlist(plant).subscribe();
  }
}
