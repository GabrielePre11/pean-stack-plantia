import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Container } from '@/app/layout/container/container';
import { ReviewService } from '@/app/services/review.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-reviews',
  imports: [Container, CommonModule],
  templateUrl: './home-reviews.html',
  styleUrl: './home-reviews.css',
})
export class HomeReviews implements OnInit {
  private reviewsService = inject(ReviewService);

  // States
  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);

  // Reviews & Average
  reviews = this.reviewsService.reviews;
  reviewsAverage = computed(
    () =>
      this.reviews().reduce((acc, review) => acc + review.rating, 0) /
      this.reviews().length
  );

  // On Init
  ngOnInit(): void {
    this.isLoading.set(true);
    this.errorState.set(null);

    this.reviewsService.getHomeReviews().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorState.set(err?.error?.message || 'Something went wrong.');
      },
    });
  }

  // Stars Limit
  stars = Array.from({ length: 5 });

  // Current Slide
  currentIndex = signal<number>(0);

  // Ref
  sliderRef = viewChild<ElementRef<HTMLUListElement>>('reviewsSliderRef');

  // Go to a specific slide by its index
  goToSlide(index: number) {
    // Update the current index so that I can know which slide is active
    this.currentIndex.set(index);

    // @ Scroll the slider container horizontally to the correct slide (and smoothly)
    // @ "left" is how far to scroll: slide number * width of the container
    // @ offsetWidth indicates how wide the slider is right now on the screen,
    // @ so we can scroll exactly one full slide at a time on any device

    // @ Example: if I'd have put * 300px, the design would break, because the screen size changes!

    this.sliderRef()?.nativeElement.scrollTo({
      left: index * this.sliderRef()!.nativeElement.offsetWidth,
      behavior: 'smooth',
    });
  }

  prevSlide() {
    const prevIndex =
      (this.currentIndex() - 1 + this.reviews().length) % this.reviews().length;
    this.goToSlide(prevIndex);
  }

  nextSlide() {
    const nextIndex = (this.currentIndex() + 1) % this.reviews().length;
    this.goToSlide(nextIndex);
  }
}
