import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { WishlistResponse } from '../models/types/wishlist.type';
import { Plant } from '../models/types/plant.type';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private serverUrl = 'http://localhost:3000/api/v1/wishlist';

  constructor(private httpClient: HttpClient) {}

  private _wishlistItems = signal<Plant[]>([]);
  readonly wishlistItems = this._wishlistItems.asReadonly();

  setWishlistItems(items: Plant[]) {
    this._wishlistItems.set(items);
  }

  /**
   * @ With Credentials 'cause the server will check
   * @ if the user is logged in (in the controller: const userId = req.user?.id)
   */

  getUserWishlist(): Observable<WishlistResponse> {
    return this.httpClient
      .get<WishlistResponse>(`${this.serverUrl}`, {
        withCredentials: true,
      })
      .pipe(
        tap((data: WishlistResponse) => {
          this.setWishlistItems(data.items);
        })
      );
  }

  toggleWishlist(plant: Plant): Observable<WishlistResponse> {
    // UI Update
    const current = this._wishlistItems();
    const alreadyExists = current.some(
      (existingPlant) => existingPlant.id === plant.id
    );

    this.setWishlistItems(
      alreadyExists
        ? current.filter((existingPlant) => existingPlant.id !== plant.id)
        : [...current, plant]
    );

    return this.httpClient
      .post<WishlistResponse>(
        `${this.serverUrl}/${plant.slug}`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((data: WishlistResponse) => {
          this.setWishlistItems(data.items);
        })
      );
  }

  isAlreadyInWishlist(plantSlug: string): boolean {
    return this.wishlistItems().some((plant) => plant.slug === plantSlug);
  }
}
