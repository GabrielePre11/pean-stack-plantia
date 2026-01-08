import { Plant } from '@/app/models/types/plant.type';
import { PlantService } from '@/app/services/plant.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Container } from '@/app/layout/container/container';
import { CardSkeletonCard } from '@/app/shared/card-skeleton-card/card-skeleton-card';
import { PlantCard } from '@/app/shared/plant-card/plant-card';
import { PlantDetailSkeletonCard } from '@/app/shared/plant-detail-skeleton-card/plant-detail-skeleton-card';
import { ReviewSkeletonCard } from '@/app/shared/review-skeleton-card/review-skeleton-card';
import { ReviewCard } from '@/app/shared/review-card/review-card';
import { CartService } from '@/app/services/cart.service';
import { WishlistService } from '@/app/services/wishlist.service';
import { AuthService } from '@/app/services/auth.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '@/app/services/review.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-shop-plant-detail-page',
  imports: [
    CommonModule,
    RouterModule,
    Container,
    ReactiveFormsModule,
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
  private authService = inject(AuthService);
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private reviewService = inject(ReviewService);
  private messageService = inject(MessageService);

  constructor(private route: ActivatedRoute) {}

  // Plant SLug from URL Params
  plantSlug: string | null = null;

  // States
  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);

  // Lifecycle
  /**
   * @ effect() was removed and replaced with ngOnInit() because it was not reacting
   * @ to any signals changes.
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      if (slug) {
        this.plantSlug = String(slug);

        this.isLoading.set(true);

        this.plantsService.getPlant(this.plantSlug).subscribe({
          next: () => {
            this.isLoading.set(false);
          },
          error: (err) => {
            this.isLoading.set(false);
            this.errorState.set(err?.error?.message || 'Something went wrong');
          },
        });
      }
    });
  }

  // User
  user = this.authService.user;

  // Plant | Plant Reviews | Similar Plants
  plant = this.plantsService.plant;
  plantReviews = this.reviewService.reviews;
  similarPlants = this.plantsService.recommendedPlants;

  // Form States
  isCreateReviewOpen = signal<boolean>(false);
  isFormSubmitted = signal<boolean>(false);

  // Limits
  plantsLimit = Array.from({ length: 4 });
  reviewsLimit = Array.from({ length: 3 });
  reviewsStars = Array.from({ length: 5 });

  // Form
  rating = new FormControl<number>(0, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.min(1),
      Validators.max(5),
      Validators.pattern(/^\d+$/),
    ],
  });

  message = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.minLength(10),
      Validators.maxLength(100),
      Validators.pattern(/^[a-zA-Z0-9\s.,!?:;'-]+$/),
    ],
  });

  // Forms Errors Methods
  getRatingErrors(): string {
    if (this.rating.errors?.['required']) return 'Rating is required.';
    if (this.rating.errors?.['min']) return 'Rating must be at least 1.';
    if (this.rating.errors?.['max']) return 'Rating must be lower than 6.';
    if (this.rating.errors?.['pattern']) return 'Rating must be a number.';
    return '';
  }

  getMessageErrors(): string {
    if (this.message.errors?.['minlength'])
      return 'Message must be at least 10 characters long.';
    if (this.message.errors?.['maxlength'])
      return 'Message must be at most 100 characters long.';
    if (this.message.errors?.['pattern'])
      return 'Message must not contain special characters!';
    return '';
  }

  // Wishlist Methods
  isAlreadyInWishlist(slug: string) {
    return this.wishlistService.isAlreadyInWishlist(slug);
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

  // Cart Methods
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

  // Review Methods
  toggleReviewForm() {
    this.isCreateReviewOpen.update((prev) => !prev);
  }

  // Create Review Form Methods
  onSubmit(e: Event, plantId: number) {
    e.preventDefault();
    this.isFormSubmitted.set(true);

    if (!this.rating.valid || !this.message.valid) return;

    this.isLoading.set(true);

    this.reviewService
      .createReview({
        plantId: plantId,
        rating: this.rating.value,
        message: this.message.value ?? '',
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.errorState.set(null);
          this.isFormSubmitted.set(false);

          this.messageService.add({
            severity: 'success',
            summary: 'Review Created',
            detail: `A review has been created for plant ${plantId}.`,
          });

          // Form Reset
          this.toggleReviewForm();
          this.rating.reset(0);
          this.message.reset('');
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorState.set(err?.error?.message || 'Something went wrong');

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err?.error?.message ||
              'An error occurred while submitting your review.',
          });
        },
      });
  }
}
