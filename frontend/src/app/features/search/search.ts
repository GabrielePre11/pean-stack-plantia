import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Container } from '@/app/layout/container/container';
import { PlantService } from '@/app/services/plant.service';
import { CardSkeletonCard } from '@/app/shared/card-skeleton-card/card-skeleton-card';
import { PlantCard } from '@/app/shared/plant-card/plant-card';

@Component({
  selector: 'app-search',
  imports: [CommonModule, RouterModule, Container, CardSkeletonCard, PlantCard],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  private plantService = inject(PlantService);

  // Plant SLug from URL Params
  query: string | null = null;

  isLoading = signal(false);
  errorState = signal<string | null>(null);
  plants = this.plantService.plants;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const query: string = params.get('q') || '';

      if (query) {
        this.query = query;

        this.isLoading.set(true);

        this.plantService
          // page: undefined | filters: undefined | search: this.query
          .getPlants(undefined, undefined, this.query)
          .subscribe({
            next: () => {
              this.isLoading.set(false);
            },
            error: (err) => {
              this.isLoading.set(false);
              this.errorState.set(
                err?.error?.message || 'Something went wrong'
              );
            },
          });
      }
    });
  }
}
