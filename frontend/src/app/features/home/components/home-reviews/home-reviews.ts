import { Component, computed, effect, inject, signal } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { ReviewService } from '@/app/services/review.service';
import { HomeReviewsResponse } from '@/app/models/types/review.type';
import { Review } from '@/app/models/types/review.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-reviews',
  imports: [Container, CommonModule],
  templateUrl: './home-reviews.html',
  styleUrl: './home-reviews.css',
})
export class HomeReviews {
  private reviewsService = inject(ReviewService);

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);

  // TODO: fare [] e rimuovere | NULL in altri componenti
  reviews = signal<Review[]>([]);
  reviewsAverage = computed(
    () =>
      this.reviews().reduce((acc, review) => acc + review.rating, 0) /
      this.reviews().length
  );

  stars = Array.from({ length: 5 });

  constructor() {
    effect(() => {
      this.isLoading.set(true);
      this.errorState.set(null);

      this.reviewsService.getHomeReviews().subscribe({
        next: (data: HomeReviewsResponse) => {
          this.isLoading.set(false);
          this.reviews.set(data.reviews);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorState.set(err?.error?.message || 'Something went wrong.');
        },
      });
    });
  }
}
