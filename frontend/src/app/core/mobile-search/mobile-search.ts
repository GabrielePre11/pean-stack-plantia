import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-mobile-search',
  imports: [CommonModule],
  templateUrl: './mobile-search.html',
  styleUrl: './mobile-search.css',
})
export class MobileSearch {
  isOpen = input<boolean>();
  close = output<boolean>();

  closeMobileSearch() {
    this.close.emit(false);
  }
}
