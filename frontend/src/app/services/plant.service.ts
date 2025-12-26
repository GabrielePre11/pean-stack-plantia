import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlantResponse } from '../models/types/plant.type';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private serverUrl = 'http://localhost:3000/api/v1/plants';

  constructor(private httpClient: HttpClient) {}

  /**
   * TODO: Type the responses
   * TODO: Add filters on getPlants() method
   * TODO: Create Dashboard Functions
   */

  getPlants() {
    return this.httpClient.get<PlantResponse>(`${this.serverUrl}`);
  }

  getPlant(slug: string) {
    return this.httpClient.get(`${this.serverUrl}/${slug}`);
  }
}
