import { Routes } from '@angular/router';
import { authGuard } from '@/app/guards/auth-guard';
import { noAuthGuard } from '@/app/guards/no-auth-guard';

export const routes: Routes = [
  //============== Main ==============//
  {
    path: '',
    loadComponent: () => import('@/app/features/home/home').then((m) => m.Home),
  },

  {
    path: 'shop',
    loadComponent: () => import('@/app/features/shop/shop').then((m) => m.Shop),
  },

  {
    path: 'shop/plants/:slug',
    loadComponent: () =>
      import(
        '@/app/features/shop/shop-plant-detail-page/shop-plant-detail-page'
      ).then((m) => m.ShopPlantDetailPage),
  },

  //============== Auth Routes [Protected by noAuthGuard] ==============//
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    canActivateChild: [noAuthGuard],
    children: [
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
    ],
  },
];
