import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { CityResult } from '../../services/location.service';
import { LanguageService } from '../../services/language.service';

export type RichDestination = CityResult & {
  image: string;
  tagline: string;
  climate: string;
  restaurants: string[];
  attractions: string[];
  budget: string;
};

@Component({
  selector: 'app-destination-card',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './destination-card.html',
  styleUrl: './destination-card.scss',
})
export class DestinationCard {
  readonly language = inject(LanguageService);
  readonly destination = input.required<RichDestination>();
  readonly selected = output<CityResult>();

  useFallbackImage(event: Event): void {
    const image = event.target as HTMLImageElement;

    image.src = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=82';
  }
}
