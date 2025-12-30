import { Component } from '@angular/core';

@Component({
  selector: 'app-review-skeleton-card',
  imports: [],
  templateUrl: './review-skeleton-card.html',
  styleUrl: './review-skeleton-card.css',
})
export class ReviewSkeletonCard {
  fakeReviewStars = Array.from({ length: 5 });
}
