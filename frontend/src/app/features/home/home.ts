import { Component } from '@angular/core';
import { HeroSection } from '@/app/features/home/components/hero-section/hero-section';
import { HomePlants } from '@/app/features/home/components/home-plants/home-plants';
import { HomeQuote } from './components/home-quote/home-quote';

@Component({
  selector: 'app-home',
  imports: [HeroSection, HomePlants, HomeQuote],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
