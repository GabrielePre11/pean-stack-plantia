import { Routes } from '@angular/router';

export const routes: Routes = [
  //============== Main ==============//
  {
    path: '',
    loadComponent: () => import('@/app/features/home/home').then((m) => m.Home),
  },

  //============== Login & Register [Protected] ==============//
  {
    path: 'login',
    loadComponent: () =>
      import('@/app/features/auth/login-page/login-page').then(
        (m) => m.LoginPage
      ),
  },

  {
    path: 'register',
    loadComponent: () =>
      import('@/app/features/auth/register-page/register-page').then(
        (m) => m.RegisterPage
      ),
  },
];
