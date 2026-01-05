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

export interface ReviewResponse {
  message: string;
  review: {
    comment?: string;
    createdAt: Date;
    id: number;
    plantId: number;
    rating: number;
    updatedAt: Date;
    user: { email: string; name: string };
    userId: number;
  };
}

export type ReviewBody = {
  plantId: number;
  rating: number;
  message?: string;
};
