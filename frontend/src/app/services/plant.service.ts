import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  DetailedPlantPageResponse,
  Plant,
  PlantBody,
  PlantResponse,
} from '@/app/models/types/plant.type';
import { Observable, switchMap, tap } from 'rxjs';
import { FiltersType } from '../models/types/filters.type';
import { ReviewService } from './review.service';
import { CategoryService } from './category.service';
import { similarPlantsResponse } from '../models/types/category.type';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private serverUrl = `${environment.apiURL}/plants`;

  private reviewService = inject(ReviewService);
  private categoryService = inject(CategoryService);

  constructor(private httpClient: HttpClient) {}

  // Private variables
  private _plants = signal<Plant[]>([]);
  private _plant = signal<Plant | null>(null);
  private _recommendedPlants = signal<Plant[]>([]);
  private _totalPlants = signal<number>(0);
  private _totalPages = signal<number>(0);

  // Public (readonly) variables
  readonly plants = this._plants.asReadonly();
  readonly plant = this._plant.asReadonly();
  readonly recommendedPlants = this._recommendedPlants.asReadonly();
  readonly totalPlants = this._totalPlants.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();

  setPlants(plants: Plant[]) {
    this._plants.set(plants);
  }

  setPlant(plant: Plant) {
    this._plant.set(plant);
  }

  setRecommendedPlants(plants: Plant[]) {
    this._recommendedPlants.set(plants);
  }

  setTotalPlants(totalPlants: number) {
    this._totalPlants.set(totalPlants);
  }

  setTotalPages(count: number, limit: number) {
    this._totalPages.set(Math.ceil(count / limit));
  }

  getPlants(
    page?: number,
    filters?: Partial<FiltersType>,
    search?: string
  ): Observable<PlantResponse> {
    let httpParams = new HttpParams();

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    }

    if (search) {
      httpParams = httpParams.set('search', search);
    }

    return this.httpClient
      .get<PlantResponse>(`${this.serverUrl}?page=${page}`, {
        params: httpParams,
      })
      .pipe(
        tap((data: PlantResponse) => {
          if (Array.isArray(data.plants)) {
            this.setPlants(data.plants);
          }
          this.setTotalPlants(data.count);
          this.setTotalPages(data.count, data.limit);
        })
      );
  }

  getPlant(
    slug: string
  ): Observable<DetailedPlantPageResponse | similarPlantsResponse> {
    return this.httpClient
      .get<DetailedPlantPageResponse>(`${this.serverUrl}/${slug}`)
      .pipe(
        tap((data: DetailedPlantPageResponse) => {
          this.setPlant(data.plant);

          // Setting Plant Reviews
          if (Array.isArray(data.reviews)) {
            this.reviewService.setReviews(data.reviews);
          }
        })
      )
      .pipe(
        // Nested Call to get Recommended Plants
        switchMap((data: DetailedPlantPageResponse) => {
          return this.categoryService.getCategory(data.plant.category.slug);
        })
      )
      .pipe(
        // Tap Operator performs a side effect and set up the Recommended Plants data
        tap((data: similarPlantsResponse) => {
          if (Array.isArray(data.categoryPlants)) {
            this.setRecommendedPlants(
              data.categoryPlants
                .filter((currentPlant) => currentPlant.id !== this.plant()?.id)
                .slice(0, 4)
            );
          }
        })
      );
  }

  // Dashboard Methods
  createPlant({
    name,
    categoryId,
    description,
    image,
    price,
    stock,
    isActive,
    careLevel,
    light,
    water,
  }: PlantBody): Observable<Plant> {
    return this.httpClient
      .post<Plant>(
        `${this.serverUrl}/create`,
        {
          name,
          categoryId,
          description,
          image,
          price,
          stock,
          isActive,
          careLevel,
          light,
          water,
        },
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap((plant: Plant) => {
          this._plants.update((prev) => [...prev, plant]);
        })
      );
  }

  updatePlant(
    plantSlug: string,
    {
      name,
      categoryId,
      description,
      image,
      price,
      stock,
      isActive,
      careLevel,
      light,
      water,
    }: Partial<PlantBody>
  ): Observable<Plant> {
    return this.httpClient
      .put<Plant>(
        `${this.serverUrl}/update/${plantSlug}`,
        {
          name,
          categoryId,
          description,
          image,
          price,
          stock,
          isActive,
          careLevel,
          light,
          water,
        },
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap((plantToUpdate: Plant) => {
          this._plants.update((prev) =>
            prev.map((currentPlant) =>
              currentPlant.id === plantToUpdate.id
                ? { ...currentPlant, ...plantToUpdate }
                : currentPlant
            )
          );
        })
      );
  }

  deletePlant(plantSlug: string): Observable<Plant> {
    return this.httpClient
      .delete<Plant>(`${this.serverUrl}/delete/${plantSlug}`, {
        withCredentials: true,
      })
      .pipe(
        tap((plantToDelete: Plant) => {
          this._plants.update((prev) =>
            prev.filter((currentPlant) => currentPlant.id !== plantToDelete.id)
          );
        })
      );
  }
}
