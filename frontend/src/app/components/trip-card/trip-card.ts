import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { Trip, TripService } from '../../services/trip.service';

@Component({
  selector: 'app-trip-card',
  imports: [CurrencyPipe, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.scss',
})
export class TripCard {
  private readonly trips = inject(TripService);
  private readonly fallbackImage = 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=720&q=80';

  readonly trip = input.required<Trip>();
  readonly removed = output<number>();

  imageUrl(): string {
    return this.trips.imageUrl(this.trip());
  }

  travelPeriod(): string {
    const { start_date, end_date } = this.trip();

    if (start_date && end_date) {
      if (start_date === end_date) {
        return this.formatTripDate(start_date);
      }

      return `${this.formatTripDate(start_date)} - ${this.formatTripDate(end_date)}`;
    }

    if (start_date) {
      return `A partir de ${this.formatTripDate(start_date)}`;
    }

    if (end_date) {
      return `Até ${this.formatTripDate(end_date)}`;
    }

    return 'Sem datas definidas';
  }

  useFallbackImage(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (image.src === this.fallbackImage) {
      return;
    }

    image.src = this.fallbackImage;
  }

  private formatTripDate(value: string): string {
    return formatDate(value, 'dd/MM/yyyy', 'en-US');
  }
}
