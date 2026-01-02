import { Plant } from '@/app/models/types/plant.type';
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
  readonly plant = input.required<Plant>();

  reviews = Array.from({ length: 5 });

  toggleWishlist(plant: Plant) {
    this.wishlistService.toggleWishlist(plant).subscribe({});
  }

  isAlreadyInWishlist(slug: string) {
    return this.wishlistService.isAlreadyInWishlist(slug);
  }
}
