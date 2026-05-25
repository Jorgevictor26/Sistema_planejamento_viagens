import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { Trip, TripService } from '../../services/trip.service';

@Component({
  selector: 'app-trip-card',
  imports: [CurrencyPipe, DatePipe, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.scss',
})
export class TripCard {
  private readonly trips = inject(TripService);

  readonly trip = input.required<Trip>();
  readonly removed = output<number>();

  imageUrl(): string | null {
    return this.trips.imageUrl(this.trip());
  }
}
