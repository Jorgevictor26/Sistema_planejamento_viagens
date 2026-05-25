import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { CityResult, LocationService, WeatherResult } from '../../services/location.service';
import { ThemeToggle } from '../../shared/theme-toggle/theme-toggle';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ThemeToggle,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage {
  private readonly locations = inject(LocationService);
  readonly auth = inject(AuthService);

  readonly cityControl = new FormControl<string | CityResult>('', { nonNullable: true });
  readonly selectedCity = signal<CityResult | null>(null);
  readonly weather = signal<WeatherResult | null>(null);
  readonly error = signal('');

  readonly cities$: Observable<CityResult[]> = this.cityControl.valueChanges.pipe(
    startWith(''),
    map((value) => typeof value === 'string' ? value : value.name || ''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((query) => query.length >= 2 ? this.locations.searchDestinations(query).pipe(
      map((response) => response.data),
      catchError(() => of([])),
    ) : of([])),
  );

  constructor() {
    this.auth.me().subscribe();
  }

  displayCity(city: CityResult | string): string {
    if (typeof city === 'string') {
      return city;
    }

    if (city.type === 'country') {
      return [city.name, city.country_code].filter(Boolean).join(' - ');
    }

    return [city.name, city.region, city.country].filter(Boolean).join(', ');
  }

  chooseCity(city: CityResult): void {
    this.selectedCity.set(city);
    this.weather.set(null);
    this.error.set('');

    if (city.type === 'country') {
      this.error.set('Selecione uma cidade desse pais para ver o clima atual.');
      return;
    }

    if (city.latitude === null || city.longitude === null) {
      this.error.set('Destino sem coordenadas disponiveis.');
      return;
    }

    this.locations.weather(city.latitude, city.longitude).subscribe({
      next: (response) => this.weather.set(response.data),
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel carregar o clima atual.'),
    });
  }
}
