import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  AuthResponse,
  SignIn,
  SignInResponse,
  SignUp,
  User,
} from '@/app/models/types/auth.type';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private serverUrl = 'http://localhost:3000/api/v1/auth';
  private _user = signal<User | null>(null);

  // A signal inside a service is called "Singleton"
  readonly user = this._user.asReadonly();

  constructor(private httpClient: HttpClient) {}

  // Update the user signal
  setUser(user: User | null) {
    this._user.set(user);
  }

  checkAuth() {
    return this.httpClient
      .get<AuthResponse>(`${this.serverUrl}/check-auth`, {
        withCredentials: true,
      })
      .pipe(map((res) => res.user));
  }

  signIn({ email, password }: SignIn) {
    return this.httpClient.post<SignInResponse>(
      `${this.serverUrl}/sign-in`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
  }

  signUp({ name, email, password }: SignUp) {
    return this.httpClient.post(
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
    return this.httpClient.post(
      `${this.serverUrl}/sign-out`,
      {},
      { withCredentials: true }
    );
  }
}
