import { Category } from '@/app/models/types/category.type';
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-card',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './category-card.html',
  styleUrl: './category-card.css',
})
export class CategoryCard {
  category = input.required<Category>();

  POPULAR_CATEGORIES_COVERS: Record<string, string> = {
    ficus: '/ficus.avif',
    palm: '/palm.avif',
    fern: '/fern.avif',
    begonia: '/begonia.avif',
  };
}
