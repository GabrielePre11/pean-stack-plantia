import { Component, effect, inject, signal } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { CategoryService } from '@/app/services/category.service';
import { Category, CategoryResponse } from '@/app/models/types/category.type';
import { CategoryCard } from '@/app/shared/category-card/category-card';
import { CategorySkeletonCard } from '@/app/shared/category-skeleton-card/category-skeleton-card';

@Component({
  selector: 'app-popular-categories',
  imports: [Container, CategoryCard, CategorySkeletonCard],
  templateUrl: './popular-categories.html',
  styleUrl: './popular-categories.css',
})
export class PopularCategories {
  private categoryService = inject(CategoryService);

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);
  categories = signal<Category[]>([]);

  popularCategories = ['ficus', 'palm', 'fern', 'begonia'];
  popularCategoriesLimit: number[] = Array.from({ length: 4 });

  constructor() {
    effect(() => {
      this.isLoading.set(true);
      this.errorState.set(null);

      this.categoryService.getCategories().subscribe({
        next: (data: CategoryResponse) => {
          const categories = data.categories.filter((category) =>
            this.popularCategories.includes(category.slug)
          );

          this.isLoading.set(false);
          this.categories.set(categories);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorState.set(err?.error?.message || 'Something went wrong');
        },
      });
    });
  }
}
