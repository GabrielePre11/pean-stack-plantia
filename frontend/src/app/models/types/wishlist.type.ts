import { Plant } from '@/app/models/types/plant.type';

export type WishlistResponse = {
  wishlistId: number;
  items: Plant[];
  totalItems: number;
};
