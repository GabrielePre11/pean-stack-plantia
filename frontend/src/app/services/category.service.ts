import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CategoryResponse,
  similarPlantsResponse,
} from '@/app/models/types/category.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private serverUrl = 'http://localhost:3000/api/v1/categories';

  constructor(private httpClient: HttpClient) {}

  getCategories(): Observable<CategoryResponse> {
    return this.httpClient.get<CategoryResponse>(`${this.serverUrl}`);
  }

  getCategory(slug: string): Observable<similarPlantsResponse> {
    return this.httpClient.get<similarPlantsResponse>(
      `${this.serverUrl}/${slug}`
    );
  }
}
