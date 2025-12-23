import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  AuthResponse,
  SignIn,
  SignInUpResponse,
  SignUp,
  User,
} from '@/app/models/types/auth.type';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private serverUrl = 'http://localhost:3000/api/v1/auth';

  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

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

  checkAuth() {
    return this.httpClient
      .get<AuthResponse>(`${this.serverUrl}/check-auth`, {
        withCredentials: true,
      })
      .pipe(
        map((res) => res.user),
        tap((user) => this._user.set(user))
      );
  }

  signIn({ email, password }: SignIn) {
    return this.httpClient.post<SignInUpResponse>(
      `${this.serverUrl}/sign-in`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
  }

  signUp({ name, email, password }: SignUp) {
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
      .pipe(tap(() => this._user.set(null)));
  }
}
