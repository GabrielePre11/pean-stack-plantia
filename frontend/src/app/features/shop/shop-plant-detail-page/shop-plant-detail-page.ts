import {
  DetailedPlantPageResponse,
  Plant,
} from '@/app/models/types/plant.type';
import { PlantService } from '@/app/services/plant.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Container } from '@/app/layout/container/container';
import { Review } from '@/app/models/types/review.type';
import { CategoryService } from '@/app/services/category.service';
import { CardSkeletonCard } from '@/app/shared/card-skeleton-card/card-skeleton-card';
import { PlantCard } from '@/app/shared/plant-card/plant-card';
import { similarPlantsResponse } from '@/app/models/types/category.type';
import { PlantDetailSkeletonCard } from '@/app/shared/plant-detail-skeleton-card/plant-detail-skeleton-card';
import { ReviewSkeletonCard } from '@/app/shared/review-skeleton-card/review-skeleton-card';
import { ReviewCard } from '@/app/shared/review-card/review-card';
import { CartService } from '@/app/services/cart.service';
import { WishlistService } from '@/app/services/wishlist.service';

@Component({
  selector: 'app-shop-plant-detail-page',
  imports: [
    CommonModule,
    RouterModule,
    Container,
    CardSkeletonCard,
    PlantCard,
    PlantDetailSkeletonCard,
    ReviewSkeletonCard,
    ReviewCard,
  ],
  templateUrl: './shop-plant-detail-page.html',
  styleUrl: './shop-plant-detail-page.css',
})
export class ShopPlantDetailPage implements OnInit {
  private plantsService = inject(PlantService);
  private categoryService = inject(CategoryService);

  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);

  constructor(private route: ActivatedRoute) {}

  plantSlug: string | null = null;

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);
  plant = signal<Plant | null>(null);
  similarPlants = signal<Plant[]>([]);
  plantReviews = signal<Review[]>([]);

  plantsLimit = Array.from({ length: 4 });
  reviewsLimit = Array.from({ length: 3 });
  reviewsStars = Array.from({ length: 5 });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      if (slug) {
        this.plantSlug = String(slug);
        this.effect();
      }
    });
  }

  effect() {
    if (this.plantSlug) {
      this.isLoading.set(true);
      this.errorState.set(null);

      // Plants
      this.plantsService.getPlant(this.plantSlug).subscribe({
        next: (data: DetailedPlantPageResponse) => {
          this.isLoading.set(false);
          this.errorState.set(null);

          this.plant.set(data.plant);
          if (Array.isArray(data.reviews)) {
            this.plantReviews.set(data.reviews);
          }

          // Recommended Plants
          const categorySlug = data.plant.category.slug;

          this.categoryService.getCategory(categorySlug).subscribe({
            next: (data: similarPlantsResponse) => {
              if (Array.isArray(data.categoryPlants)) {
                this.similarPlants.set(data.categoryPlants.slice(0, 4));
              }
            },
            error: (err) => {
              this.isLoading.set(false);
              this.errorState.set(
                err?.error?.message || 'Something went wrong'
              );
            },
          });
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorState.set(err?.error?.message || 'Something went wrong');
        },
      });
    }
  }

  toggleWishlist(plant: Plant) {
    if (!plant) return;
    this.wishlistService.toggleWishlist(plant).subscribe();
  }

  isAlreadyInWishlist(slug: string) {
    return this.wishlistService.isAlreadyInWishlist(slug);
  }

  addToCart(plant: Plant) {
    this.cartService.addToCart(plant).subscribe();
  }
}
