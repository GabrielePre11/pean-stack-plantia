import { CartItem } from '@/app/models/types/cart.type';
import { Plant } from '@/app/models/types/plant.type';
import { CartService } from '@/app/services/cart.service';
import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';

@Component({
  selector: 'app-cart-item-card',
  imports: [CommonModule],
  templateUrl: './cart-item-card.html',
  styleUrl: './cart-item-card.css',
})
export class CartItemCard {
  private cartService = inject(CartService);

  item = input.required<CartItem>();

  addToCart(plant: Plant) {
    this.cartService.addToCart(plant).subscribe();
  }

  removeFromCart(plant: Plant) {
    this.cartService.removeFromCart(plant).subscribe();
  }
}
