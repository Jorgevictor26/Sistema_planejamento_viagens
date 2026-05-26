import { AsyncPipe } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
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
    RouterLink,
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

    if (city) {
      this.emitDestination(city);
      return;
    }

    const query = this.queryText();

    if (query.length < 2) {
      this.error.set(this.language.language() === 'en'
        ? 'Type a destination before searching.'
        : 'Digite um destino antes de pesquisar.');
      return;
    }

    const curatedCity = this.cityOnlySuggestions(query, [])[0];

    if (curatedCity) {
      this.chooseCity(curatedCity);
      this.emitDestination(curatedCity);
      return;
    }

    this.locations.searchDestinations(query).pipe(
      map((response) => this.cityOnlySuggestions(query, response.data)[0] || null),
      catchError(() => of(null)),
    ).subscribe((foundCity) => {
      if (!foundCity) {
        this.error.set(this.language.language() === 'en'
          ? 'We could not find this destination. Try another city name.'
          : 'Não encontramos esse destino. Tente outro nome de cidade.');
        return;
      }

      this.chooseCity(foundCity);
      this.emitDestination(foundCity);
    });
  }

  exploreDestinations(): void {
    document.getElementById('destinos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private emitDestination(city: CityResult): void {
    localStorage.setItem('travel_planner_selected_destination', JSON.stringify({
      city: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
    }));

    this.destinationSelected.emit(city);
  }

  private queryText(): string {
    const value = this.searchControl.value;

    return typeof value === 'string' ? value.trim() : `${value.name}, ${value.country}`.trim();
  }

  private cityOnlySuggestions(query: string, results: CityResult[]): CityResult[] {
    const cities = results.filter((item) => item.type === 'city' && item.latitude !== null && item.longitude !== null);
    const normalizedQuery = this.normalizeSearch(query);
    const curated = curatedCities.filter((city) => {
      const haystack = this.normalizeSearch(`${city.name} ${city.country} ${city.region}`);

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

  private normalizeSearch(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }
}
