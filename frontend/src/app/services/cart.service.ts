import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Plant } from '../models/types/plant.type';
import { catchError, Observable, tap } from 'rxjs';
import { CartItem, CartResponse } from '@/app/models/types/cart.type';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private serverUrl = 'http://localhost:3000/api/v1/cart';

  constructor(private httpClient: HttpClient) {}

  private _cartItems = signal<CartItem[]>([]);
  readonly cartItems = this._cartItems.asReadonly();

  readonly totalItems = signal(0);
  readonly totalAmount = signal(0);
  readonly totalQuantity = signal(0);

  getUserCart(): Observable<CartResponse> {
    return this.httpClient
      .get<CartResponse>(`${this.serverUrl}`, {
        withCredentials: true,
      })
      .pipe(
        tap((data: CartResponse) => {
          this._cartItems.set(data.items);
          this.totalItems.set(data.totalItems);
          this.totalAmount.set(data.totalAmount);
          this.totalQuantity.set(data.totalQuantity);
        })
      );
  }

  addToCart(plant: Plant): Observable<CartResponse> {
    // UI Optimistic Update
    const prevItems = this._cartItems();
    const prevTotalQuantity = this.totalQuantity();
    const prevTotalAmount = this.totalAmount();

    const updatedItems = [...prevItems];
    const existingPlant = updatedItems.find(
      (item) => item.plant.id === plant.id
    );

    if (existingPlant) {
      existingPlant.quantity += 1;
    } else {
      updatedItems.push({ id: -1, plant, quantity: 1 });
    }

    this._cartItems.set(updatedItems);
    this.totalQuantity.update((prevTotalQuantity) => prevTotalQuantity + 1);
    this.totalAmount.update((prevTotalAmount) => prevTotalAmount + plant.price);

    return this.httpClient
      .post<CartResponse>(
        `${this.serverUrl}/${plant.slug}`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((data: CartResponse) => {
          this._cartItems.set(data.items);
          this.totalItems.set(data.totalItems);
          this.totalAmount.set(data.totalAmount);
          this.totalQuantity.set(data.totalQuantity);
        }),
        catchError((err) => {
          // Rollback (it returns the previous state)
          this._cartItems.set(prevItems);
          this.totalQuantity.set(prevTotalQuantity);
          this.totalAmount.set(prevTotalAmount);
          throw err;
        })
      );
  }

  removeFromCart(plant: Plant): Observable<CartResponse> {
    // UI Optimistic Update
    const prevItems = this._cartItems();

    const updatedItems = prevItems
      .map((item) =>
        item.plant.id === plant.id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    this._cartItems.set(updatedItems);

    return this.httpClient
      .delete<CartResponse>(`${this.serverUrl}/${plant.slug}`, {
        withCredentials: true,
      })
      .pipe(
        tap((data: CartResponse) => {
          this._cartItems.set(data.items);
          this.totalItems.set(data.totalItems);
          this.totalAmount.set(data.totalAmount);
          this.totalQuantity.set(data.totalQuantity);
        }),
        catchError((err) => {
          // Rollback
          this._cartItems.set(prevItems);
          throw err;
        })
      );
  }
}
