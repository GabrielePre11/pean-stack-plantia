import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryResponse } from '@/app/models/types/category.type';
import { Plant } from '@/app/models/types/plant.type';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private serverUrl = 'http://localhost:3000/api/v1/categories';

  constructor(private httpClient: HttpClient) {}

  getCategories() {
    return this.httpClient.get<CategoryResponse>(`${this.serverUrl}`);
  }

  // controllare
  getCategory(slug: string) {
    return this.httpClient.get<Plant[]>(`${this.serverUrl}/${slug}`);
  }
}
