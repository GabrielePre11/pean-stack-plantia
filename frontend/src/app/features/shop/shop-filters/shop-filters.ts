import { PLANTS_FILTERS } from '@/app/models/constants/plants-filters';
import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-shop-filters',
  imports: [CommonModule],
  templateUrl: './shop-filters.html',
  styleUrl: './shop-filters.css',
})
export class ShopFilters {
  plantsFilters = PLANTS_FILTERS;

  filtersOpen = input.required<boolean>();

  onChangeFilters = output<{ type: string; value: string | null }>();
  onCloseFilters = output<boolean>();

  changeFilters(key: string, e: Event) {
    const target = e.target as HTMLSelectElement;

    this.onChangeFilters.emit({
      type: key,
      value: target.value,
    });
  }

  closeFilters() {
    this.onCloseFilters.emit(false);
  }
}
