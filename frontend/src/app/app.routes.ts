import { Routes } from '@angular/router';
import { authGuard } from '@/app/guards/auth-guard';
import { noAuthGuard } from '@/app/guards/no-auth-guard';
import { adminGuard } from '@/app/guards/admin-guard';

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

  {
    path: 'search/:q',
    loadComponent: () =>
      import('@/app/features/search/search').then((m) => m.Search),
  },

  //============== User Wishlist & Cart Routes [Protected by authGuard] ==============//
  {
    path: 'user',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'wishlist',
        loadComponent: () =>
          import('@/app/features/user/wishlist/wishlist').then(
            (m) => m.Wishlist
          ),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('@/app/features/user/cart/cart').then((m) => m.Cart),
      },
    ],
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

  //============== Admin Dashboard Routes [Protected by adminGuard] ==============//
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    canActivateChild: [authGuard, adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@/app/features/dashboard/dashboard').then((m) => m.Dashboard),
      },
    ],
  },
];
