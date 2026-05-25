import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { Itinerary } from '../../services/itinerary.service';

@Component({
  selector: 'app-itinerary-list',
  imports: [MatButtonModule],
  templateUrl: './itinerary-list.html',
  styleUrl: './itinerary-list.scss',
})
export class ItineraryList {
  readonly itineraries = input.required<Itinerary[]>();
  readonly loading = input(false);
  readonly edited = output<Itinerary>();
  readonly removed = output<number>();
}
