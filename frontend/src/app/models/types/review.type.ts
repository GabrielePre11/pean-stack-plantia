export interface Review {
  comment?: string;
  createdAt: Date;
  id: number;
  rating: number;
  updatedAt: Date;
  user: { name: string };
  userId: number;
}

export interface HomeReviewsResponse {
  reviews: Review[];
}
