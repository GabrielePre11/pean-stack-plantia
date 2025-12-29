import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plant, PlantResponse } from '@/app/models/types/plant.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private serverUrl = 'http://localhost:3000/api/v1/plants';

  constructor(private httpClient: HttpClient) {}

  getPlants(page?: number): Observable<PlantResponse> {
    let httpParams = new HttpParams();

    return this.httpClient.get<PlantResponse>(
      `${this.serverUrl}?page=${page}`,
      {
        params: httpParams,
      }
    );
  }

  getPlant(slug: string): Observable<Plant> {
    return this.httpClient.get<Plant>(`${this.serverUrl}/${slug}`);
  }
}
