import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Container } from '@/app/layout/container/container';
import { AuthService } from '@/app/services/auth.service';
import { CategoryService } from '@/app/services/category.service';
import { PlantService } from '@/app/services/plant.service';
import { ReviewService } from '@/app/services/review.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DASHBOARD_CATEGORIES } from '@/app/models/constants/dashboard-categories';
import { FiltersType } from '@/app/models/types/filters.type';
import { UpdatePlantForm } from './components/update-plant-form/update-plant-form';
import {
  CareLevel,
  LightType,
  Plant,
  WaterType,
} from '@/app/models/types/plant.type';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    Container,
    ReactiveFormsModule,
    UpdatePlantForm,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private plantService = inject(PlantService);
  private categoryService = inject(CategoryService);
  private reviewService = inject(ReviewService);

  // States
  isLoading = signal(false);
  errorState = signal<string | null>(null);
  isAddPlantFormOpen = signal<boolean>(false);
  isEditPlantFormOpen = signal<boolean>(false);
  isFormSubmitted = signal<boolean>(false);

  // Auth Section
  users = this.authService.users;
  admins = this.authService.admins;
  totalUsers = this.authService.totalUsers;
  totalAdmins = this.authService.totalAdmins;

  // Plants Section
  plants = this.plantService.plants;
  totalPlants = this.plantService.totalPlants;
  totalPages = this.plantService.totalPages;
  currentPage = signal<number>(1);
  plantToEdit = signal<Plant | null>(null);

  // Categories Section
  categories = this.categoryService.dashboardCategories;
  totalCategories = this.categoryService.totalCategories;

  // Reviews Section
  reviews = this.reviewService.dashboardReviews;
  totalReviews = this.reviewService.totalReviews;

  // Form
  name = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Z\s]+$/),
    ],
  });
  categoryId = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1)],
  });
  description = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(10),
      Validators.pattern(/^[a-zA-Z0-9\s.,!?:;'-]+$/),
    ],
  });
  image = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  price = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1)],
  });
  careLevel = new FormControl<CareLevel>(CareLevel.EASY, {
    nonNullable: true,
    validators: [Validators.required],
  });
  light = new FormControl<LightType>(LightType.LOW, {
    nonNullable: true,
    validators: [Validators.required],
  });
  water = new FormControl<WaterType>(WaterType.MEDIUM, {
    nonNullable: true,
    validators: [Validators.required],
  });
  stock = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1)],
  });
  isActive = new FormControl<boolean>(false, {
    nonNullable: true,
    validators: [Validators.required],
  });

  // Constants & Enums
  CareLevel = CareLevel;
  LightType = LightType;
  WaterType = WaterType;
  dashboardCategories = DASHBOARD_CATEGORIES;

  // Plant Form Errors
  getNameError(): string {
    if (this.name.hasError('required')) return 'Name is required';
    if (this.name.hasError('minlength'))
      return 'Name must be at least 3 characters long';
    if (this.name.hasError('pattern'))
      return 'Name must contain only letters and spaces';
    return '';
  }

  getDescriptionError(): string {
    if (this.description.hasError('required')) return 'Description is required';
    if (this.description.hasError('minlength'))
      return 'Description must be at least 10 characters long';
    if (this.description.hasError('pattern'))
      return 'Description must not contain special characters!';
    return '';
  }

  getImageError(): string {
    if (this.image.hasError('required')) return 'Image is required';
    return '';
  }

  getPriceError(): string {
    if (this.price.hasError('required')) return 'Price is required';
    if (this.price.hasError('min')) return 'Price must be at least 1';
    return '';
  }

  getStockError(): string {
    if (this.stock.hasError('required')) return 'Stock is required';
    if (this.stock.hasError('min')) return 'Stock must be at least 1';
    return '';
  }

  getCareLevelError(): string {
    if (this.careLevel.hasError('required')) return 'Care Level is required';
    return '';
  }

  getLightError(): string {
    if (this.light.hasError('required')) return 'Light is required';
    return '';
  }

  getWaterError(): string {
    if (this.water.hasError('required')) return 'Water is required';
    return '';
  }

  getIsActiveError(): string {
    if (this.isActive.hasError('required')) return 'Active is required';
    return '';
  }

  constructor() {
    effect(() => {
      this.isLoading.set(true);
      this.errorState.set(null);

      this.plantService
        .getPlants(
          this.currentPage(),
          <Pick<FiltersType, 'sort'>>{ sort: 'newest' },
          undefined
        )
        .subscribe({
          next: () => {
            this.isLoading.set(false);
          },
          error: (err) => {
            this.isLoading.set(false);
            this.errorState.set(err?.error?.message || 'Something went wrong');
          },
        });
    });
  }

  ngOnInit(): void {
    this.isLoading.set(true);

    this.authService.getUsers().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorState.set(err?.error?.message || 'Something went wrong.');
      },
    });
  }

  // Toggle ADD Plant Form
  toggleAddPlantForm() {
    this.isAddPlantFormOpen.update((prev) => !prev);
  }

  // Toggle EDIT Plant Form
  toggleEditPlantForm(plantToEdit: Plant | null) {
    this.plantToEdit.set(plantToEdit);
    this.isEditPlantFormOpen.update((prev) => !prev);
  }

  // Plants Pagination Methods
  goToPrevPage() {
    if (this.currentPage() > 1) this.currentPage.update((prev) => prev - 1);
  }

  goToNextPage() {
    if (this.currentPage() < this.totalPages())
      this.currentPage.update((prev) => prev + 1);
  }

  onSubmit(e: Event) {
    e.preventDefault();
    this.isFormSubmitted.set(true);

    if (
      !this.name.valid ||
      !this.description.valid ||
      !this.image.valid ||
      !this.price.valid ||
      !this.categoryId.valid ||
      !this.isActive.valid ||
      !this.careLevel.valid ||
      !this.light.valid ||
      !this.water.valid ||
      !this.stock.valid
    )
      return;

    this.isLoading.set(true);

    this.plantService
      .createPlant({
        name: this.name.value,
        categoryId: Number(this.categoryId.value),
        description: this.description.value,
        image: this.image.value,
        price: this.price.value,
        stock: this.stock.value,
        isActive: this.isActive.value,
        careLevel: this.careLevel.value,
        light: this.light.value,
        water: this.water.value,
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.isAddPlantFormOpen.set(false);

          // Form Reset
          this.name.reset('');
          this.categoryId.reset(1);
          this.description.reset('');
          this.image.reset('');
          this.price.reset(0);
          this.stock.reset(0);
          this.careLevel.reset();
          this.light.reset();
          this.water.reset();
          this.isActive.reset(true);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorState.set(err?.error?.message || 'Something went wrong.');
        },
      });
  }

  deletePlant(plantSlug: string) {
    this.isLoading.set(true);
    this.plantService.deletePlant(plantSlug).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorState.set(err?.error?.message || 'Something went wrong.');
      },
    });
  }
}
