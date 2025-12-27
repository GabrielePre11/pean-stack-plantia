import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private serverUrl = 'http://localhost:3000/api/v1/reviews';

  constructor(private httpClient: HttpClient) {}

  getHomeReviews() {
    return this.httpClient.get(`${this.serverUrl}`);
  }
}
