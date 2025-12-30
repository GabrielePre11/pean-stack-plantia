import { Category } from '@/app/models/types/category.type';
import { Review } from '@/app/models/types/review.type';

export type PlantReview = {
  comment?: string;
  rating: number;
};

export interface Plant {
  additionalImages?: string[];
  careLevel: CareLevel;
  category: Category;
  categoryId: number;
  createdAt: Date;
  description: string;
  id: number;
  image: string;
  isActive: boolean;
  light: LightType;
  name: string;
  price: number;
  reviews: PlantReview[];
  slug: string;
  stock: number;
  updatedAt: Date;
  water: WaterType;
}

export interface PlantResponse {
  count: number;
  limit: number;
  page: number;
  pages: number;
  plants: Plant[];
  plantsCount: number;
}

export interface DetailedPlantPageResponse {
  averageRating: number;
  plant: Plant;
  reviews: Review[];
  totalReviews: number;
}

enum CareLevel {
  EASY,
  MEDIUM,
  HARD,
}

enum LightType {
  LOW,
  INDIRECT,
  DIRECT,
}

enum WaterType {
  LOW,
  MEDIUM,
  HIGH,
}
