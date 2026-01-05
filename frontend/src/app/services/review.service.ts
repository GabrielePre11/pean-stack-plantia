import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  HomeReviewsResponse,
  Review,
  ReviewBody,
  ReviewResponse,
} from '@/app/models/types/review.type';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private serverUrl = 'http://localhost:3000/api/v1/reviews';

  constructor(private httpClient: HttpClient) {}

  private _reviews = signal<Review[]>([]);
  readonly reviews = this._reviews.asReadonly();

  setReviews(reviews: Review[]) {
    this._reviews.set(reviews);
  }

  getHomeReviews(): Observable<HomeReviewsResponse> {
    return this.httpClient.get<HomeReviewsResponse>(`${this.serverUrl}`);
  }

  createReview({
    plantId,
    rating,
    message,
  }: ReviewBody): Observable<ReviewResponse> {
    return this.httpClient
      .post<ReviewResponse>(
        `${this.serverUrl}/create/${plantId}`,
        { rating, comment: message },
        { withCredentials: true }
      )
      .pipe(
        tap((data: ReviewResponse) => {
          const alreadyExists = this._reviews().some(
            (review) => review.id === data.review.id
          );

          alreadyExists
            ? this._reviews.update((prev) => prev)
            : this._reviews.update((prev) => [...prev, data.review]);
        })
      );
  }

  updateReview({
    plantId,
    rating,
    message,
  }: ReviewBody): Observable<ReviewResponse> {
    return this.httpClient
      .put<ReviewResponse>(
        `${this.serverUrl}/update/${plantId}`,
        { rating, comment: message },
        { withCredentials: true }
      )
      .pipe(
        tap((data: ReviewResponse) => {
          this._reviews.update((prev) =>
            prev.map((currentReview) =>
              currentReview.id === data.review.id ? data.review : currentReview
            )
          );
        })
      );
  }

  deleteReview(plantId: number): Observable<ReviewResponse> {
    return this.httpClient
      .delete<ReviewResponse>(`${this.serverUrl}/delete/${plantId}`, {
        withCredentials: true,
      })
      .pipe(
        tap((data: ReviewResponse) => {
          this._reviews.update((prev) =>
            prev.filter(
              (reviewToDelete) => reviewToDelete.id !== data.review.id
            )
          );
        })
      );
  }
}
