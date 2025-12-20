import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-container',
  imports: [CommonModule],
  templateUrl: './container.html',
  styleUrl: './container.css',
})
export class Container {
  className = input<string>('');
}
