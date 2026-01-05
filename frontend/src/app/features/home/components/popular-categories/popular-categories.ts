import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { CategoryService } from '@/app/services/category.service';
import { CategoryCard } from '@/app/shared/category-card/category-card';
import { CategorySkeletonCard } from '@/app/shared/category-skeleton-card/category-skeleton-card';

@Component({
  selector: 'app-popular-categories',
  imports: [Container, CategoryCard, CategorySkeletonCard],
  templateUrl: './popular-categories.html',
  styleUrl: './popular-categories.css',
})
export class PopularCategories implements OnInit {
  private categoryService = inject(CategoryService);

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);
  categories = this.categoryService.categories;

  // Popular Categories Limit
  popularCategoriesLimit: number[] = Array.from({ length: 4 });

  /**
   * @ effect() was removed and replaced with ngOnInit() because it was not reacting
   * @ to any signals / changes.
   */
  ngOnInit(): void {
    this.isLoading.set(true);
    this.errorState.set(null);

    this.categoryService.getCategories().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorState.set(err?.error?.message || 'Something went wrong');
      },
    });
  }
}
