import { Component } from '@angular/core';
import { HeroSection } from '@/app/features/home/components/hero-section/hero-section';
import { HomePlants } from '@/app/features/home/components/home-plants/home-plants';
import { HomeQuote } from './components/home-quote/home-quote';
import { PopularCategories } from './components/popular-categories/popular-categories';

@Component({
  selector: 'app-home',
  imports: [HeroSection, HomePlants, HomeQuote, PopularCategories],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
