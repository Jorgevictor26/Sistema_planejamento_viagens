import { Component, effect, inject, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { CityResult, LocationService, WeatherResult } from '../../services/location.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-weather-widget',
  imports: [MatCardModule],
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.scss',
})
export class WeatherWidget {
  private readonly locations = inject(LocationService);
  readonly language = inject(LanguageService);

  readonly destination = input<CityResult | null>(null);
  readonly weather = signal<WeatherResult | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');

  constructor() {
    effect(() => {
      const destination = this.destination();

      if (!destination || destination.latitude === null || destination.longitude === null) {
        this.weather.set(null);
        return;
      }

      this.loading.set(true);
      this.error.set('');

      this.locations.weather(destination.latitude, destination.longitude).subscribe({
        next: (response) => this.weather.set(response.data),
        error: () => this.error.set('Clima indisponivel para este destino.'),
        complete: () => this.loading.set(false),
      });
    });
  }
}
