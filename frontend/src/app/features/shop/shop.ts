import { Component, effect, inject, signal } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { PlantService } from '@/app/services/plant.service';
import { Plant, PlantResponse } from '@/app/models/types/plant.type';
import { CardSkeletonCard } from '@/app/shared/card-skeleton-card/card-skeleton-card';
import { PlantCard } from '@/app/shared/plant-card/plant-card';

@Component({
  selector: 'app-shop',
  imports: [Container, CardSkeletonCard, PlantCard],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
  private plantService = inject(PlantService);

  isLoading = signal(false);
  errorState = signal<string | null>(null);
  plants = signal<Plant[]>([]);

  currentPage = signal<number>(1);
  totalPlants = signal<number>(0);
  totalPages = signal<number>(0);

  plantsLimit = Array.from({ length: 10 });

  goToPrevPage() {
    if (this.currentPage() > 1) this.currentPage.update((prev) => prev - 1);
  }

  goToNextPage() {
    if (this.currentPage() < this.totalPages())
      this.currentPage.update((prev) => prev + 1);
  }

  constructor() {
    effect(() => {
      this.isLoading.set(true);
      this.errorState.set(null);

      this.plantService.getPlants(this.currentPage()).subscribe({
        next: (data: PlantResponse) => {
          if (Array.isArray(data.plants)) {
            console.log(data);
            this.isLoading.set(false);
            this.errorState.set(null);
            this.totalPlants.set(data.count);
            this.totalPages.set(Math.ceil(data.count / data.limit));
            this.plants.set(data.plants);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorState.set(err?.error?.message || 'Something went wrong');
        },
      });
    });
  }
}
