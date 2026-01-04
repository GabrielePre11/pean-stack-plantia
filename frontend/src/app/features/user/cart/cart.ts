import { Component, inject, OnInit, signal } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { CartService } from '@/app/services/cart.service';
import { CommonModule } from '@angular/common';
import { CartItemCard } from '@/app/shared/cart-item-card/cart-item-card';
import { RouterModule } from '@angular/router';
import { WishlistService } from '@/app/services/wishlist.service';
import { Plant } from '@/app/models/types/plant.type';
import { CartItemSkeletonCard } from '@/app/shared/cart-item-skeleton-card/cart-item-skeleton-card';
import { CartWishlistItemCard } from '@/app/shared/cart-wishlist-item-card/cart-wishlist-item-card';
import { CartWishlistItemSkeletonCard } from '@/app/shared/cart-wishlist-item-skeleton-card/cart-wishlist-item-skeleton-card';

@Component({
  selector: 'app-cart',
  imports: [
    Container,
    CommonModule,
    RouterModule,
    CartItemCard,
    CartItemSkeletonCard,
    CartWishlistItemCard,
    CartWishlistItemSkeletonCard,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);
  shippingPrice = signal<number>(0);

  // Cart Service
  cartItems = this.cartService.cartItems;
  totalItems = this.cartService.totalItems;
  totalAmount = this.cartService.totalAmount;
  totalQuantity = this.cartService.totalQuantity;
  wishlistItems = this.wishlistService.wishlistItems;

  ngOnInit(): void {
    this.isLoading.set(true);
    this.errorState.set(null);

    // GET: User Cart
    this.cartService.getUserCart().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorState.set(err?.error?.message || 'Something went wrong');
      },
    });

    // GET: User Wishlist
    this.wishlistService.getUserWishlist().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorState.set(err?.error?.message || 'Something went wrong');
      },
    });
  }

  addToCart(plant: Plant) {
    this.cartService.addToCart(plant).subscribe();
  }

  removeFromWishlist(plant: Plant) {
    this.wishlistService.toggleWishlist(plant).subscribe();
  }
}
