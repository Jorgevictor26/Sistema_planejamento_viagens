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
    id: 'curated-london',
    name: 'London',
    city: 'London',
    country: 'UK',
    country_code: 'UK',
    region: 'England',
    latitude: 51.5074,
    longitude: -0.1278,
    population: 8982000,
  },
  {
    type: 'city',
    id: 'curated-long-beach',
    name: 'Long Beach',
    city: 'Long Beach',
    country: 'USA',
    country_code: 'USA',
    region: 'California',
    latitude: 33.7701,
    longitude: -118.1937,
    population: 451307,
  },
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
    this.error.set('');
  }

  saveDestination(): void {
    const city = this.selectedCity();

    if (!city) {
      this.error.set('Escolha uma cidade sugerida antes de continuar.');
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

  private cityOnlySuggestions(query: string, results: CityResult[]): CityResult[] {
    const cities = results.filter((item) => item.type === 'city' && item.latitude !== null && item.longitude !== null);
    const normalizedQuery = query.toLowerCase();
    const curated = normalizedQuery.startsWith('lon') ? curatedCities : [];
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
