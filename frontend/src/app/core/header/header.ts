import { Component, effect, inject, signal } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { Logo } from '@/app/shared/logo/logo';
import { MobileMenu } from '@/app/core/mobile-menu/mobile-menu';
import { CommonModule } from '@angular/common';
import { MobileSearch } from '@/app/core/mobile-search/mobile-search';
import { DesktopMenu } from '@/app/core/desktop-menu/desktop-menu';
import { DesktopSearch } from '@/app/core/desktop-search/desktop-search';
import { AuthService } from '@/app/services/auth.service';
import { RouterModule } from '@angular/router';
import { UserMenu } from '../user-menu/user-menu';

@Component({
  selector: 'app-header',
  imports: [
    Container,
    Logo,
    MobileMenu,
    CommonModule,
    MobileSearch,
    DesktopMenu,
    DesktopSearch,
    RouterModule,
    UserMenu,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  readonly title = 'Plantia';

  user = this.authService.user;

  isMobileMenuOpen = signal<boolean>(false);
  isDesktopMenuOpen = signal<boolean>(false);
  isMobileSearchOpen = signal<boolean>(false);
  isUserMenuOpen = signal<boolean>(false);
  isHeaderScrolled = signal<boolean>(false);
  scrollY = signal<number>(window.scrollY);

  windowWidth = signal<number>(window.innerWidth);

  constructor() {
    effect(() => {
      if (this.isMobileMenuOpen()) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }

      window.addEventListener('scroll', () => {
        this.scrollY.set(window.scrollY);
        this.isHeaderScrolled.set(window.scrollY > 0);
      });

      window.addEventListener('resize', () => {
        this.windowWidth.set(window.innerWidth);
      });

      return () => {
        window.removeEventListener('scroll', () => {});
        window.removeEventListener('resize', () => {});
      };
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((prev) => !prev);
    this.isMobileSearchOpen.set(false);
    this.isUserMenuOpen.set(false);
  }

  toggleMobileSearch() {
    this.isMobileSearchOpen.update((prev) => !prev);
    this.isMobileMenuOpen.set(false);
    this.isUserMenuOpen.set(false);
  }

  toggleDesktopSearch() {
    this.isMobileSearchOpen.set(false);
    this.isMobileMenuOpen.set(false);
    this.isUserMenuOpen.set(false);
    this.isDesktopMenuOpen.update((prev) => !prev);
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update((prev) => !prev);
    this.isMobileMenuOpen.set(false);
    this.isMobileSearchOpen.set(false);
  }
}
