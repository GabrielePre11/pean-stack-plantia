import { Plant } from '@/app/models/types/plant.type';
import { Review } from '@/app/models/types/review.type';
import { AuthService } from '@/app/services/auth.service';
import { ReviewService } from '@/app/services/review.service';
import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-card',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-card.html',
  styleUrl: './review-card.css',
})
export class ReviewCard {
  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);

  review = input.required<Review>();
  user = this.authService.user;
  plant = input.required<Plant>();

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);
  isUpdateReviewOpen = signal<boolean>(false);
  isFormSubmitted = signal<boolean>(false);

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

  toggleReviewForm() {
    const currentReview = this.review();

    // Setting the current/old values to the fields
    this.rating.setValue(currentReview.rating);
    this.message.setValue(currentReview.comment || '');
    this.isUpdateReviewOpen.update((prev) => !prev);
  }

  updateReview(e: Event, plantId: number) {
    e.preventDefault();
    this.isFormSubmitted.set(true);

    if (!this.rating.valid || !this.message.valid) return;

    this.isLoading.set(true);

    this.reviewService
      .updateReview({
        plantId,
        rating: this.rating.value,
        message: this.message.value,
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.errorState.set(null);
          this.isUpdateReviewOpen.set(false);
          this.isFormSubmitted.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorState.set(err?.error?.message || 'Something went wrong');
        },
      });
  }

  deleteReview(plantId: number) {
    this.reviewService.deleteReview(plantId).subscribe();
  }
}
