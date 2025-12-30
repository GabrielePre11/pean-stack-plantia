import { Component } from '@angular/core';

@Component({
  selector: 'app-plant-detail-skeleton-card',
  imports: [],
  templateUrl: './plant-detail-skeleton-card.html',
  styleUrl: './plant-detail-skeleton-card.css',
})
export class PlantDetailSkeletonCard {
  fakeReviewsStars = Array.from({ length: 5 });
}
