import { Component, effect, inject, signal } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { CategoryService } from '@/app/services/category.service';
import { Category, CategoryResponse } from '@/app/models/types/category.type';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-popular-categories',
  imports: [Container, RouterModule, RouterLink],
  templateUrl: './popular-categories.html',
  styleUrl: './popular-categories.css',
})
export class PopularCategories {
  private categoryService = inject(CategoryService);

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);
  categories = signal<Category[] | null>(null);

  popularCategories = ['ficus', 'palm', 'fern', 'begonia'];

  POPULAR_CATEGORIES_COVERS: Record<string, string> = {
    ficus: '/ficus.avif',
    palm: '/palm.avif',
    fern: '/fern.avif',
    begonia: '/begonia.avif',
  };

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
