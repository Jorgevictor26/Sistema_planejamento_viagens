import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { Trip } from '../../services/trip.service';

@Component({
  selector: 'app-recent-trips',
  imports: [DatePipe, MatButtonModule, RouterLink],
  templateUrl: './recent-trips.html',
  styleUrl: './recent-trips.scss',
})
export class RecentTrips {
  readonly trips = input.required<Trip[]>();
}
