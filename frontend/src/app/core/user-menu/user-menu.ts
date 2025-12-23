import { AuthService } from '@/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  imports: [RouterModule, CommonModule],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
})
export class UserMenu {
  private authService = inject(AuthService);
  user = this.authService.user;

  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);
  isOpen = input();

  signOut() {
    this.isLoading.set(true);
    this.errorState.set(null);

    this.authService.signOut().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.errorState.set(null);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorState.set(err?.error?.message || 'Something went wrong.');
      },
    });
  }
}
