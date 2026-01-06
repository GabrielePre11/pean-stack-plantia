import { Component, effect, inject, signal } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { PlantService } from '@/app/services/plant.service';
import { Plant, PlantResponse } from '@/app/models/types/plant.type';
import { CardSkeletonCard } from '@/app/shared/card-skeleton-card/card-skeleton-card';
import { PlantCard } from '@/app/shared/plant-card/plant-card';
import { FiltersType } from '@/app/models/types/filters.type';
import { ShopFilters } from './shop-filters/shop-filters';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  imports: [Container, CardSkeletonCard, PlantCard, ShopFilters, CommonModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
  private plantService = inject(PlantService);

  isLoading = signal(false);
  errorState = signal<string | null>(null);

  // Filters Toggle
  filtersOpen = signal<boolean>(false);

  // Plants & Plants Limit
  plants = this.plantService.plants;
  plantsLimit = Array.from({ length: 8 });

  // Pagination
  currentPage = signal<number>(1);
  totalPlants = this.plantService.totalPlants;
  totalPages = this.plantService.totalPages;

  // Filters
  selectedFilters = signal<FiltersType>({
    category: null,
    sort: null,
    careLevel: null,
    light: null,
    water: null,
  });

  goToPrevPage() {
    if (this.currentPage() > 1) this.currentPage.update((prev) => prev - 1);
  }

  goToNextPage() {
    if (this.currentPage() < this.totalPages())
      this.currentPage.update((prev) => prev + 1);
  }

  toggleFilters() {
    this.filtersOpen.update((prev) => !prev);
  }

  updateFilters(key: string, value: string | null) {
    this.selectedFilters.update((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  constructor() {
    effect(() => {
      this.isLoading.set(true);
      this.errorState.set(null);

      this.plantService
        .getPlants(this.currentPage(), this.selectedFilters())
        .subscribe({
          next: () => {
            this.isLoading.set(false);
          },
          error: (err) => {
            this.isLoading.set(false);
            this.errorState.set(err?.error?.message || 'Something went wrong');
          },
        });
    });
  }
}
