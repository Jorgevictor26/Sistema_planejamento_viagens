import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { activityExamples, Itinerary, ItineraryPayload } from '../../services/itinerary.service';
import { Trip } from '../../services/trip.service';

@Component({
  selector: 'app-itinerary-form',
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './itinerary-form.html',
  styleUrl: './itinerary-form.scss',
})
export class ItineraryForm {
  private readonly fb = inject(FormBuilder);

  readonly trips = input.required<Trip[]>();
  readonly itinerary = input<Itinerary | null>(null);
  readonly loading = input(false);
  readonly submitted = output<ItineraryPayload>();
  readonly cancelled = output<void>();

  readonly examples = activityExamples;

  readonly form = this.fb.nonNullable.group({
    trip_id: [0, [Validators.required, Validators.min(1)]],
    day: [1, [Validators.required, Validators.min(1)]],
    activity: ['', [Validators.required, Validators.maxLength(255)]],
    location: [''],
    time: [''],
    description: [''],
  });

  constructor() {
    effect(() => {
      const itinerary = this.itinerary();

      if (!itinerary) {
        return;
      }

      this.form.patchValue({
        trip_id: itinerary.trip_id,
        day: itinerary.day,
        activity: itinerary.activity,
        location: itinerary.location || '',
        time: itinerary.time ? itinerary.time.slice(0, 5) : '',
        description: itinerary.description || '',
      });
    });
  }

  useExample(activity: string): void {
    this.form.controls.activity.setValue(activity);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    this.submitted.emit({
      trip_id: Number(raw.trip_id),
      day: Number(raw.day),
      activity: raw.activity,
      location: raw.location || null,
      time: raw.time || null,
      description: raw.description || null,
    });

    if (!this.itinerary()) {
      this.form.patchValue({
        day: raw.day,
        activity: '',
        location: '',
        time: '',
        description: '',
      });
    }
  }
}
