import { Component } from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  imports: [Container, CommonModule, RouterModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection {}
