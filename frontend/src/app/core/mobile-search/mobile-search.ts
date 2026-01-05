import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-search',
  imports: [CommonModule],
  templateUrl: './mobile-search.html',
  styleUrl: './mobile-search.css',
})
export class MobileSearch {
  private router = inject(Router);

  // Input & Output
  isOpen = input.required<boolean>();
  close = output<boolean>();

  // Methods
  closeMobileSearch() {
    this.close.emit(false);
  }

  onSubmit(e: Event, userQuery: string) {
    e.preventDefault();

    if (!userQuery.trim()) return;
    this.router.navigate(['/search', userQuery]);
    this.closeMobileSearch();
  }
}
