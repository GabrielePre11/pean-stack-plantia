import { Plant } from '@/app/models/types/plant.type';

export interface CartItem {
  id: number;
  plant: Plant;
  quantity: number;
}

export interface CartResponse {
  cartId: number;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  totalQuantity: number;
}
