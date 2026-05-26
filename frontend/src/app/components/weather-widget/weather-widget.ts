import { Component, effect, inject, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { CityResult, LocationService, PlaceResult, WeatherResult } from '../../services/location.service';
import { LanguageService } from '../../services/language.service';
import { TripMap } from '../trip-map/trip-map';

@Component({
  selector: 'app-weather-widget',
  imports: [MatCardModule, TripMap],
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.scss',
})
export class WeatherWidget {
  private readonly locations = inject(LocationService);
  readonly language = inject(LanguageService);

  readonly destination = input<CityResult | null>(null);
  readonly showIntro = input(true);
  readonly showMap = input(true);
  readonly showPlaces = input(true);
  readonly weather = signal<WeatherResult | null>(null);
  readonly places = signal<PlaceResult[]>([]);
  readonly loading = signal(false);
  readonly placesLoading = signal(false);
  readonly error = signal('');

  constructor() {
    effect(() => {
      const destination = this.destination();

      if (!destination || destination.latitude === null || destination.longitude === null) {
        this.weather.set(null);
        this.places.set([]);
        return;
      }

      this.loading.set(true);
      this.placesLoading.set(true);
      this.error.set('');

      this.locations.weather(destination.latitude, destination.longitude).subscribe({
        next: (response) => this.weather.set(response.data),
        error: () => this.error.set('Clima indisponivel para este destino.'),
        complete: () => this.loading.set(false),
      });

      if (!this.showPlaces()) {
        this.places.set([]);
        this.placesLoading.set(false);
        return;
      }

      this.locations.nearbyPlaces(destination.latitude, destination.longitude).subscribe({
        next: (response) => this.places.set(this.uniquePlaces(response.data)),
        error: () => this.places.set([]),
        complete: () => this.placesLoading.set(false),
      });
    });
  }

  private uniquePlaces(places: PlaceResult[]): PlaceResult[] {
    return Array.from(
      new Map(places.map((place) => [this.placeKey(place), place])).values(),
    );
  }

  private placeKey(place: PlaceResult): string {
    return [
      place.id,
      place.name?.trim().toLowerCase(),
      place.address?.trim().toLowerCase(),
    ].filter(Boolean).join('|');
  }
}
