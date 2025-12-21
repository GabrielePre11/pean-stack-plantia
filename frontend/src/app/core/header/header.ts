import { Component, effect, signal } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { Logo } from '@/app/shared/logo/logo';
import { MobileMenu } from '../mobile-menu/mobile-menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [Container, Logo, MobileMenu, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly title = 'Plantia';

  isMobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((prev) => !prev);
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
