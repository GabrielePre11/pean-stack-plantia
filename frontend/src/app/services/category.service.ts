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
  private _dashboardCategories = signal<Category[]>([]);
  private _totalCategories = signal<number>(0);

  readonly categories = this._categories.asReadonly();
  readonly dashboardCategories = this._dashboardCategories.asReadonly();
  readonly totalCategories = this._totalCategories.asReadonly();

  popularCategories = ['ficus', 'palm', 'fern', 'begonia'];

  setCategories(categories: Category[]) {
    this._categories.set(categories);
  }

  setDashboardCategories(categories: Category[]) {
    this._dashboardCategories.set(categories);
  }

  setTotalCategories(totalCategories: number) {
    this._totalCategories.set(totalCategories);
  }

  getCategories(): Observable<CategoryResponse> {
    return this.httpClient.get<CategoryResponse>(`${this.serverUrl}`).pipe(
      tap(({ categories }) => {
        this.setTotalCategories(categories.length);
        this.setDashboardCategories(categories);

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
