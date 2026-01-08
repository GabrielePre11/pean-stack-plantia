import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DASHBOARD_CATEGORIES } from '@/app/models/constants/dashboard-categories';
import {
  CareLevel,
  LightType,
  Plant,
  WaterType,
} from '@/app/models/types/plant.type';
import { PlantService } from '@/app/services/plant.service';

@Component({
  selector: 'app-update-plant-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-plant-form.html',
  styleUrl: './update-plant-form.css',
})
export class UpdatePlantForm {
  private plantService = inject(PlantService);

  // Input & Output
  plant = input.required<Plant | null>();
  isOpen = input.required<boolean>();
  onClose = output<boolean>();

  // States
  isLoading = signal<boolean>(false);
  errorState = signal<string | null>(null);
  isFormSubmitted = signal<boolean>(false);

  // Form
  name = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)],
  });
  categoryId = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.min(1)],
  });
  description = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.minLength(10),
      Validators.pattern(/^[a-zA-Z0-9\s.,!?:;'-]+$/),
    ],
  });
  image = new FormControl<string>('', {
    nonNullable: true,
  });
  price = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.min(1)],
  });
  careLevel = new FormControl<CareLevel>(CareLevel.EASY, {
    nonNullable: true,
  });
  light = new FormControl<LightType>(LightType.LOW, {
    nonNullable: true,
  });
  water = new FormControl<WaterType>(WaterType.MEDIUM, {
    nonNullable: true,
  });
  stock = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.min(1)],
  });
  isActive = new FormControl<boolean>(false, {
    nonNullable: true,
  });

  // Constants & Enums
  CareLevel = CareLevel;
  LightType = LightType;
  WaterType = WaterType;
  dashboardCategories = DASHBOARD_CATEGORIES;

  constructor() {
    effect(() => {
      const currentPlant = this.plant();

      if (!currentPlant) return;

      // Setting the current/old values to the fields
      this.name.setValue(currentPlant.name);
      this.categoryId.setValue(currentPlant.categoryId);
      this.description.setValue(currentPlant.description);
      this.image.setValue(currentPlant.image);
      this.price.setValue(currentPlant.price);
      this.careLevel.setValue(currentPlant.careLevel);
      this.light.setValue(currentPlant.light);
      this.water.setValue(currentPlant.water);
      this.stock.setValue(currentPlant.stock);
      this.isActive.setValue(currentPlant.isActive);
    });
  }

  // Plant Form Errors
  getNameError(): string {
    if (this.name.hasError('minlength'))
      return 'Name must be at least 3 characters long';
    if (this.name.hasError('pattern'))
      return 'Name must contain only letters and spaces';
    return '';
  }

  getDescriptionError(): string {
    if (this.description.hasError('minlength'))
      return 'Description must be at least 10 characters long';
    if (this.description.hasError('pattern'))
      return 'Description must not contain special characters!';
    return '';
  }

  getPriceError(): string {
    if (this.price.hasError('min')) return 'Price must be at least 1';
    return '';
  }

  getStockError(): string {
    if (this.stock.hasError('min')) return 'Stock must be at least 1';
    return '';
  }

  // States Methods
  closeUpdateForm() {
    this.onClose.emit(false);
  }

  // Form Methods
  onSubmit(e: Event, plantSlug: string) {
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
      .updatePlant(plantSlug, {
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
          this.errorState.set(null);
          this.isFormSubmitted.set(false);
          this.onClose.emit(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorState.set(err.error.message);
        },
      });
  }
}
