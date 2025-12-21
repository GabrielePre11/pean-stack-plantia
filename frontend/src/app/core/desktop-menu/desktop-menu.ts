import { DESKTOP_MENU_LINKS } from '@/app/models/constants/desktop-menu-links';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-desktop-menu',
  imports: [RouterModule, CommonModule],
  templateUrl: './desktop-menu.html',
  styleUrl: './desktop-menu.css',
})
export class DesktopMenu {
  desktopMenuLinks = DESKTOP_MENU_LINKS;
  pathName = window.location.pathname;
}
