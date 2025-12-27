import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { HomeReviewsResponse } from '../models/types/review.type';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private serverUrl = 'http://localhost:3000/api/v1/reviews';

  constructor(private httpClient: HttpClient) {}

  getHomeReviews() {
    return this.httpClient.get<HomeReviewsResponse>(`${this.serverUrl}`);
  }
}
