import { Category } from '@/app/models/types/category.type';

export type Review = {
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
  reviews: Review[];
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
