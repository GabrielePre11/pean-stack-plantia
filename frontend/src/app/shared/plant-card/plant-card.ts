import { Plant } from '@/app/models/types/plant.type';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-plant-card',
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './plant-card.html',
  styleUrl: './plant-card.css',
})
export class PlantCard {
  plant = input.required<Plant>();

  reviews = Array.from({ length: 5 });
}
