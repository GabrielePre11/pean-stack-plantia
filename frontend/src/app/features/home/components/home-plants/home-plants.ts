import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { PlantService } from '@/app/services/plant.service';
import { PlantCard } from '@/app/shared/plant-card/plant-card';
import { CardSkeletonCard } from '@/app/shared/card-skeleton-card/card-skeleton-card';

@Component({
  selector: 'app-home-plants',
  imports: [Container, PlantCard, CardSkeletonCard],
  templateUrl: './home-plants.html',
  styleUrl: './home-plants.css',
})
export class HomePlants {
  private plantsService = inject(PlantService);

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);
  monthlyInspirationsPlants = this.plantsService.plants;

  plantsLimit = Array.from({ length: 4 });
  sliderRef = viewChild<ElementRef<HTMLUListElement>>('plantsSliderRef');

  constructor() {
    effect(() => {
      this.isLoading.set(true);

      this.plantsService.getPlants().subscribe({
        next: () => {
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorState.set(err?.error?.message || 'Something went wrong.');
        },
      });
    });
  }

  scrollToLeft() {
    this.sliderRef()?.nativeElement.scrollBy({
      left: -300,
      behavior: 'smooth',
    });
  }

  scrollToRight() {
    this.sliderRef()?.nativeElement.scrollBy({
      left: 300,
      behavior: 'smooth',
    });
  }
}
