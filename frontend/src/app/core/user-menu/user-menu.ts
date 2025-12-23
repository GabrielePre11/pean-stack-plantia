import { AuthService } from '@/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
}
