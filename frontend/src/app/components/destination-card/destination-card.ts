import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { CityResult } from '../../services/location.service';

@Component({
  selector: 'app-destination-card',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './destination-card.html',
  styleUrl: './destination-card.scss',
})
export class DestinationCard {
  readonly destination = input.required<CityResult & { image: string; tagline: string }>();
  readonly selected = output<CityResult>();
}
