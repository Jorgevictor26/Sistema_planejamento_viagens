import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Trip, TripPayload } from '../../services/trip.service';

@Component({
  selector: 'app-trip-form',
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './trip-form.html',
  styleUrl: './trip-form.scss',
})
export class TripForm {
  private readonly fb = inject(FormBuilder);

  readonly trip = input<Trip | null>(null);
  readonly loading = input(false);
  readonly submitted = output<TripPayload>();
  readonly cancelled = output<void>();

  selectedImage: File | null = null;

  readonly form = this.fb.nonNullable.group({
    destination_city: ['', [Validators.required, Validators.maxLength(255)]],
    destination_country: ['', [Validators.required, Validators.maxLength(255)]],
    latitude: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
    start_date: [''],
    end_date: [''],
    budget: [0, [Validators.min(0)]],
    description: [''],
  });

  constructor() {
    effect(() => {
      const trip = this.trip();

      if (!trip) {
        return;
      }

      this.form.patchValue({
        destination_city: trip.destination_city,
        destination_country: trip.destination_country,
        latitude: trip.latitude,
        longitude: trip.longitude,
        start_date: this.toDateInput(trip.start_date),
        end_date: this.toDateInput(trip.end_date),
        budget: trip.budget ? Number(trip.budget) : 0,
        description: trip.description || '',
      });
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files?.[0] ?? null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    this.submitted.emit({
      destination_city: raw.destination_city,
      destination_country: raw.destination_country,
      latitude: Number(raw.latitude),
      longitude: Number(raw.longitude),
      start_date: raw.start_date || null,
      end_date: raw.end_date || null,
      budget: raw.budget || null,
      description: raw.description || null,
      image: this.selectedImage,
    });
  }

  private toDateInput(value: string | null): string {
    return value ? value.slice(0, 10) : '';
  }
}
