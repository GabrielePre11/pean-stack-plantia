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

import { WishlistService } from '@/app/services/wishlist.service';
import { WishlistResponse } from '@/app/models/types/wishlist.type';
import {
  DashboardUser,
  GetAdminsResponse,
  GetUsersResponse,
} from '@/app/models/types/dashboard.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private serverUrl = 'http://localhost:3000/api/v1/auth';
  private wishlistService = inject(WishlistService);

  constructor(private httpClient: HttpClient) {}

  private _user = signal<User | null>(null);
  private _users = signal<DashboardUser[]>([]);
  private _admins = signal<DashboardUser[]>([]);
  private _totalUsers = signal<number>(0);
  private _totalAdmins = signal<number>(0);

  readonly user = this._user.asReadonly();
  readonly users = this._users.asReadonly();
  readonly admins = this._admins.asReadonly();
  readonly totalUsers = this._totalUsers.asReadonly();
  readonly totalAdmins = this._totalAdmins.asReadonly();

  setUser(user: User | null) {
    this._user.set(user);
  }

  setUsers(users: DashboardUser[]) {
    this._users.set(users);
  }

  setAdmins(admins: DashboardUser[]) {
    this._users.set(admins);
  }

  setTotalUsers(totalUsers: number) {
    this._totalUsers.set(totalUsers);
  }

  setTotalAdmins(totalAdmins: number) {
    this._totalAdmins.set(totalAdmins);
  }

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

  // Dashboard Methods
  getAdmins(): Observable<GetAdminsResponse> {
    return this.httpClient.get<GetAdminsResponse>(`${this.serverUrl}/admins`, {
      withCredentials: true,
    });
  }

  getUsers(): Observable<GetUsersResponse | GetAdminsResponse> {
    return this.httpClient
      .get<GetUsersResponse>(`${this.serverUrl}/users`, {
        withCredentials: true,
      })
      .pipe(
        tap((data: GetUsersResponse) => {
          if (Array.isArray(data.users)) this.setAdmins(data.users);
          this.setTotalUsers(data.totalUsers);
        })
      )
      .pipe(switchMap(() => this.getAdmins()))
      .pipe(
        tap((data: GetAdminsResponse) => {
          if (data.admins) {
            if (Array.isArray(data.admins)) this.setAdmins(data.admins);
            this.setTotalAdmins(data.totalAdmins);
          }
        })
      );
  }
}
