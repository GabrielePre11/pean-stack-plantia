import { Component } from '@angular/core';
import { HeroSection } from '@/app/features/home/components/hero-section/hero-section';
import { HomePlants } from '@/app/features/home/components/home-plants/home-plants';

@Component({
  selector: 'app-home',
  imports: [HeroSection, HomePlants],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
