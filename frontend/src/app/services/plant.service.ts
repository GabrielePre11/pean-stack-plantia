import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  DetailedPlantPageResponse,
  PlantResponse,
} from '@/app/models/types/plant.type';
import { Observable } from 'rxjs';
import { FiltersType } from '../models/types/filters.type';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private serverUrl = 'http://localhost:3000/api/v1/plants';

  constructor(private httpClient: HttpClient) {}

  getPlants(
    page?: number,
    filters?: Partial<FiltersType>
  ): Observable<PlantResponse> {
    let httpParams = new HttpParams();

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    }

    return this.httpClient.get<PlantResponse>(
      `${this.serverUrl}?page=${page}`,
      {
        params: httpParams,
      }
    );
  }

  getPlant(slug: string): Observable<DetailedPlantPageResponse> {
    return this.httpClient.get<DetailedPlantPageResponse>(
      `${this.serverUrl}/${slug}`
    );
  }
}
