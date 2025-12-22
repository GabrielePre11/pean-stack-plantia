import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterModule, CommonModule],
  templateUrl: './logo.html',
  styleUrl: './logo.css',
})
export class Logo {
  title = input<string>();
}
