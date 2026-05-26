import { Component, effect, inject, input, output, signal } from '@angular/core';
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
  readonly timePresets = [
    { label: 'Manhã', value: '08:00' },
    { label: 'Almoço', value: '12:00' },
    { label: 'Tarde', value: '15:00' },
    { label: 'Noite', value: '19:00' },
  ];
  readonly hourOptions = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'));
  readonly minuteOptions = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));
  readonly draftHour = signal('08');
  readonly draftMinute = signal('00');
  readonly draftPeriod = signal<'AM' | 'PM'>('AM');

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
      this.syncDraftTime(itinerary.time ? itinerary.time.slice(0, 5) : '');
    });
  }

  useExample(activity: string): void {
    this.form.controls.activity.setValue(activity);
  }

  setTime(time: string): void {
    this.form.controls.time.setValue(time);
    this.syncDraftTime(time);
  }

  setDraftHour(hour: string): void {
    this.draftHour.set(hour);
    this.updateTimeFromDraft();
  }

  setDraftMinute(minute: string): void {
    this.draftMinute.set(minute);
    this.updateTimeFromDraft();
  }

  setDraftPeriod(period: 'AM' | 'PM'): void {
    this.draftPeriod.set(period);
    this.updateTimeFromDraft();
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

  private syncDraftTime(time: string): void {
    const [hourValue = '08', minuteValue = '00'] = time.split(':');
    const hour24 = Number(hourValue);
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;

    this.draftHour.set(String(hour12).padStart(2, '0'));
    this.draftMinute.set(minuteValue.padStart(2, '0').slice(0, 2));
    this.draftPeriod.set(period);
  }

  private draftToTime(): string {
    const hour12 = Number(this.draftHour());
    const hour24 = this.draftPeriod() === 'PM'
      ? (hour12 % 12) + 12
      : hour12 % 12;

    return `${String(hour24).padStart(2, '0')}:${this.draftMinute()}`;
  }

  private updateTimeFromDraft(): void {
    this.form.controls.time.setValue(this.draftToTime());
  }
}
