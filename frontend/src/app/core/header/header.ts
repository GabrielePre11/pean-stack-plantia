import { Component, effect, signal } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { Logo } from '@/app/shared/logo/logo';
import { MobileMenu } from '../mobile-menu/mobile-menu';
import { CommonModule } from '@angular/common';
import { MobileSearch } from '../mobile-search/mobile-search';
import { DesktopMenu } from '../desktop-menu/desktop-menu';

@Component({
  selector: 'app-header',
  imports: [
    Container,
    Logo,
    MobileMenu,
    CommonModule,
    MobileSearch,
    DesktopMenu,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly title = 'Plantia';

  isMobileMenuOpen = signal<boolean>(false);
  isMobileSearchOpen = signal<boolean>(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((prev) => !prev);
  }

  toggleMobileSearch() {
    this.isMobileSearchOpen.update((prev) => !prev);
  }

  constructor() {
    effect(() => {
      if (this.isMobileMenuOpen()) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    });
  }
}
