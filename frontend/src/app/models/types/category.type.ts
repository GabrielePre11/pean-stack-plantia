import { Plant } from '@/app/models/types/plant.type';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface CategoryResponse {
  categories: Category[];
}

export interface similarPlantsResponse {
  categoryPlants: Plant[];
}
