import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  Category,
  CategoryResponse,
  similarPlantsResponse,
} from '@/app/models/types/category.type';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private serverUrl = 'http://localhost:3000/api/v1/categories';

  constructor(private httpClient: HttpClient) {}

  private _categories = signal<Category[]>([]);
  readonly categories = this._categories.asReadonly();

  popularCategories = ['ficus', 'palm', 'fern', 'begonia'];

  setCategories(categories: Category[]) {
    this._categories.set(categories);
  }

  getCategories(): Observable<CategoryResponse> {
    return this.httpClient.get<CategoryResponse>(`${this.serverUrl}`).pipe(
      tap(({ categories }) => {
        const filteredCategories = categories.filter((category) =>
          this.popularCategories.includes(category.slug)
        );
        this.setCategories(filteredCategories);
      })
    );
  }

  getCategory(slug: string): Observable<similarPlantsResponse> {
    return this.httpClient.get<similarPlantsResponse>(
      `${this.serverUrl}/${slug}`
    );
  }
}
