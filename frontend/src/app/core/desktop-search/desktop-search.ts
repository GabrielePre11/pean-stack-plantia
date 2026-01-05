import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-desktop-search',
  imports: [CommonModule],
  templateUrl: './desktop-search.html',
  styleUrl: './desktop-search.css',
})
export class DesktopSearch {
  private router = inject(Router);

  isOpen = input.required<boolean>();
  onClose = output<boolean>();

  closeDesktopSearch() {
    this.onClose.emit(false);
  }

  onSubmit(e: Event, userQuery: string) {
    e.preventDefault();

    if (!userQuery.trim()) return;
    this.router.navigate(['/search', userQuery]);
    this.closeDesktopSearch();
  }
}
