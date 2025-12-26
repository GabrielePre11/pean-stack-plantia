export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface CategoryResponse {
  categories: Category[];
}
