import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';

import { LanguageService } from '../../services/language.service';
import { CityResult, LocationService } from '../../services/location.service';

const curatedCities: CityResult[] = [
  {
    type: 'city',
    id: 'curated-luanda',
    name: 'Luanda',
    city: 'Luanda',
    country: 'Angola',
    country_code: 'AO',
    region: 'Luanda',
    latitude: -8.839,
    longitude: 13.2894,
    population: 2571861,
  },
  {
    type: 'city',
    id: 'curated-cape-town',
    name: 'Cape Town',
    city: 'Cape Town',
    country: 'South Africa',
    country_code: 'ZA',
    region: 'Western Cape',
    latitude: -33.9249,
    longitude: 18.4241,
    population: 433688,
  },
  {
    type: 'city',
    id: 'curated-cabo-ledo',
    name: 'Cabo Ledo',
    city: 'Cabo Ledo',
    country: 'Angola',
    country_code: 'AO',
    region: 'Bengo',
    latitude: -9.6717,
    longitude: 13.2326,
    population: null,
  },
];

@Component({
  selector: 'app-hero-search',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './hero-search.html',
  styleUrl: './hero-search.scss',
})
export class HeroSearch {
  private readonly locations = inject(LocationService);
  readonly language = inject(LanguageService);

  readonly destinationSelected = output<CityResult>();
  readonly authRequested = output<void>();
  readonly selectedCity = signal<CityResult | null>(null);
  readonly error = signal('');
  readonly searchControl = new FormControl<string | CityResult>('', { nonNullable: true });

  readonly canSave = computed(() => Boolean(this.selectedCity()));

  readonly suggestions$: Observable<CityResult[]> = this.searchControl.valueChanges.pipe(
    startWith(''),
    map((value) => typeof value === 'string' ? value : value.name || ''),
    debounceTime(260),
    distinctUntilChanged(),
    switchMap((query) => {
      this.selectedCity.set(null);
      this.error.set('');

      if (query.length < 2) {
        return of([]);
      }

      return this.locations.searchDestinations(query).pipe(
        map((response) => this.cityOnlySuggestions(query, response.data)),
        catchError(() => of(this.cityOnlySuggestions(query, []))),
      );
    }),
  );

  displayCity(city: CityResult | string): string {
    return typeof city === 'string' ? city : `${city.name}, ${city.country}`;
  }

  chooseCity(city: CityResult): void {
    this.selectedCity.set(city);
    this.searchControl.setValue(city, { emitEvent: false });
    this.error.set('');
  }

  saveDestination(): void {
    const city = this.selectedCity();

    if (!city) {
      this.error.set(this.language.language() === 'en'
        ? 'Choose a suggested city before continuing.'
        : 'Escolha uma cidade sugerida antes de continuar.');
      return;
    }

    localStorage.setItem('travel_planner_selected_destination', JSON.stringify({
      city: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
    }));

    this.destinationSelected.emit(city);
  }

  exploreDestinations(): void {
    document.getElementById('destinos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private cityOnlySuggestions(query: string, results: CityResult[]): CityResult[] {
    const cities = results.filter((item) => item.type === 'city' && item.latitude !== null && item.longitude !== null);
    const normalizedQuery = query.toLowerCase();
    const curated = curatedCities.filter((city) => {
      const haystack = `${city.name} ${city.country} ${city.region}`.toLowerCase();

      return haystack.includes(normalizedQuery);
    });
    const merged = [...curated, ...cities];
    const seen = new Set<string>();

    return merged.filter((city) => {
      const key = `${city.name}-${city.country}`.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    }).slice(0, 8);
  }
}
