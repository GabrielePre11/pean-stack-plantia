import { MOBILE_MENU_LINKS } from '@/app/models/constants/mobile-menu-links';
import { AuthService } from '@/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-menu',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './mobile-menu.html',
  styleUrl: './mobile-menu.css',
})
export class MobileMenu {
  private authService = inject(AuthService);

  mobileMenuLinks = MOBILE_MENU_LINKS;
  pathName = window.location.pathname;

  isOpen = input<boolean>();
  close = output<boolean>();

  user = this.authService.user;

  closeMobileMenu() {
    this.close.emit(false);
  }
}
