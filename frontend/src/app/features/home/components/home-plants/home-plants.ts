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
import { Plant, PlantResponse } from '@/app/models/types/plant.type';
import { PlantCard } from '@/app/shared/plant-card/plant-card';

@Component({
  selector: 'app-home-plants',
  imports: [Container, PlantCard],
  templateUrl: './home-plants.html',
  styleUrl: './home-plants.css',
})
export class HomePlants {
  private plantsService = inject(PlantService);

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);
  monthlyInspirationsPlants = signal<Plant[] | null>(null);

  sliderRef = viewChild<ElementRef<HTMLUListElement>>('plantsSliderRef');

  constructor() {
    effect(() => {
      this.isLoading.set(true);
      this.errorState.set(null);

      this.plantsService.getPlants().subscribe({
        next: (data: PlantResponse) => {
          this.isLoading.set(false);
          this.monthlyInspirationsPlants.set(data.plants);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorState.set(err?.error?.message || 'Something went wrong.');
          console.error(err);
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
