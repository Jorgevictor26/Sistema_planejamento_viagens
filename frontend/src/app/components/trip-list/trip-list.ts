import { Component, input, output } from '@angular/core';

import { Trip } from '../../services/trip.service';
import { TripCard } from '../trip-card/trip-card';

@Component({
  selector: 'app-trip-list',
  imports: [TripCard],
  templateUrl: './trip-list.html',
  styleUrl: './trip-list.scss',
})
export class TripList {
  readonly trips = input.required<Trip[]>();
  readonly loading = input(false);
  readonly removed = output<number>();
}
