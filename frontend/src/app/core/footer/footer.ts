import { Component } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { Logo } from '@/app/shared/logo/logo';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FOOTER_LINKS } from '@/app/models/constants/footer-links';

@Component({
  selector: 'app-footer',
  imports: [Container, CommonModule, Logo, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  readonly title = 'Plantia';
  readonly footerLinks = FOOTER_LINKS;

  currentYear = new Date().getFullYear();
}
