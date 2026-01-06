import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  AuthResponse,
  SignIn,
  SignInUpResponse,
  SignUp,
  User,
} from '@/app/models/types/auth.type';
import { map, Observable, switchMap, tap } from 'rxjs';
import { WishlistService } from './wishlist.service';
import { WishlistResponse } from '../models/types/wishlist.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private serverUrl = 'http://localhost:3000/api/v1/auth';
  private wishlistService = inject(WishlistService);

  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  setUser(user: User | null) {
    this._user.set(user);
  }

  constructor(private httpClient: HttpClient) {}

  /**
   * @ tap è un operatore di RxJS utilizzato per eseguire effetti collaterali
   * @ su un Observable senza però modificare/trasformare i valori.
   *
   * @ In questo caso, viene usato per aggiornare lo stato globale dell'utente (_user)
   * @ quando arrivano i dati dal backend:
   * @  - checkAuth() restituisce i dati dell'utente
   * @  - tap() intercetta questi dati e chiama _user.set(user)
   * @  - il flusso continua invariato verso il subscribe del componente
   *
   * @ Differenze con map():
   *  - map() trasforma il valore in un nuovo valore.
   *  - tap() osserva il valore e permette di eseguire un side-effect.
   */

  checkAuth(): Observable<AuthResponse | WishlistResponse> {
    return (
      this.httpClient
        .get<AuthResponse>(`${this.serverUrl}/check-auth`, {
          withCredentials: true,
        })
        .pipe(
          map((res) => res.user),
          tap((user) => this.setUser(user))
        )
        /**
         * @ switchMap allows us to make an annidate call to another Observable,
         * @ in this case after we set the user, we need to get its wishlist items (if available),
         * @ so that is syncronized with the wishlistItems signal
         * @ (before doing that the dark green heart in the Plant Card wasn't syncronized, there was a delay and the user had to reload the page to see the changes).
         */
        .pipe(switchMap(() => this.wishlistService.getUserWishlist()))
        .pipe(
          tap((data: WishlistResponse) => {
            this.wishlistService.setWishlistItems(data.items);
          })
        )
    );
  }

  signIn({ email, password }: SignIn): Observable<SignInUpResponse> {
    return this.httpClient.post<SignInUpResponse>(
      `${this.serverUrl}/sign-in`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
  }

  signUp({ name, email, password }: SignUp): Observable<SignInUpResponse> {
    return this.httpClient.post<SignInUpResponse>(
      `${this.serverUrl}/sign-up`,
      {
        name,
        email,
        password,
      },
      { withCredentials: true }
    );
  }

  signOut() {
    return this.httpClient
      .post(`${this.serverUrl}/sign-out`, {}, { withCredentials: true })
      .pipe(tap(() => this.setUser(null)));
  }
}
