import { AsyncPipe } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';

import { CityResult, LocationService } from '../../services/location.service';
import { Trip, TripPayload } from '../../services/trip.service';
import { NonNegativeNumberDirective } from '../../shared/non-negative-number.directive';
import { UploadBox } from '../upload-box/upload-box';
import { WeatherWidget } from '../weather-widget/weather-widget';

const curatedCities: CityResult[] = [
  {
    type: 'city',
    id: 'trip-luanda',
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
    id: 'trip-cape-town',
    name: 'Cape Town',
    city: 'Cape Town',
    country: 'South Africa',
    country_code: 'ZA',
    region: 'Western Cape',
    latitude: -33.9249,
    longitude: 18.4241,
    population: 433688,
  },
];

@Component({
  selector: 'app-trip-form',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    NonNegativeNumberDirective,
    UploadBox,
    WeatherWidget,
  ],
  templateUrl: './trip-form.html',
  styleUrl: './trip-form.scss',
})
export class TripForm {
  private readonly fb = inject(FormBuilder);
  private readonly locations = inject(LocationService);

  readonly trip = input<Trip | null>(null);
  readonly loading = input(false);
  readonly submitted = output<TripPayload>();
  readonly cancelled = output<void>();
  readonly selectedCity = signal<CityResult | null>(null);
  readonly destinationControl = this.fb.nonNullable.control<string | CityResult>('', [Validators.required]);
  readonly destinationError = signal('');
  readonly canSubmit = computed(() => this.form.valid && Boolean(this.selectedCity()));
  readonly today = new Date(new Date().setHours(0, 0, 0, 0));

  selectedImage: File | null = null;

  readonly form = this.fb.group({
    latitude: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
    start_date: [null as Date | string | null],
    end_date: [null as Date | string | null],
    budget: [0, [Validators.min(0)]],
    description: [''],
  }, { validators: [this.tripDatesValidator.bind(this)] });

  readonly cities$: Observable<CityResult[]> = this.destinationControl.valueChanges.pipe(
    startWith(''),
    map((value) => typeof value === 'string' ? value : value.name || ''),
    debounceTime(260),
    distinctUntilChanged(),
    switchMap((query) => {
      this.destinationError.set('');

      if (query.length < 2) {
        return of([]);
      }

      return this.locations.searchDestinations(query).pipe(
        map((response) => this.cityOnlySuggestions(query, response.data)),
        catchError(() => of(this.cityOnlySuggestions(query, []))),
      );
    }),
  );

  constructor() {
    effect(() => {
      const trip = this.trip();

      if (!trip) {
        return;
      }

      this.form.patchValue({
        latitude: trip.latitude,
        longitude: trip.longitude,
        start_date: this.toDateValue(trip.start_date),
        end_date: this.toDateValue(trip.end_date),
        budget: trip.budget ? Number(trip.budget) : 0,
        description: trip.description || '',
      });

      const city: CityResult = {
        type: 'city',
        id: trip.id,
        name: trip.destination_city,
        city: trip.destination_city,
        country: trip.destination_country,
        country_code: null,
        region: null,
        latitude: trip.latitude,
        longitude: trip.longitude,
        population: null,
      };

      this.selectedCity.set(city);
      this.destinationControl.setValue(city, { emitEvent: false });
    });
  }

  displayCity(city: CityResult | string): string {
    return typeof city === 'string' ? city : [city.name, city.region, city.country].filter(Boolean).join(', ');
  }

  chooseCity(city: CityResult): void {
    if (city.type !== 'city' || city.latitude === null || city.longitude === null) {
      this.destinationError.set('Selecione uma cidade válida com coordenadas.');
      return;
    }

    this.selectedCity.set(city);
    this.destinationError.set('');
    this.form.patchValue({
      latitude: city.latitude,
      longitude: city.longitude,
    });
  }

  onFilesSelected(files: File[]): void {
    this.selectedImage = files.find((file) => file.type.startsWith('image/')) ?? null;
  }

  submit(): void {
    const city = this.selectedCity();

    if (this.form.invalid || !city || city.latitude === null || city.longitude === null) {
      this.form.markAllAsTouched();
      this.destinationControl.markAsTouched();
      this.destinationError.set('Pesquise e selecione uma cidade sugerida antes de salvar.');
      return;
    }

    const raw = this.form.getRawValue();

    this.submitted.emit({
      destination_city: city.name || '',
      destination_country: city.country || '',
      latitude: city.latitude,
      longitude: city.longitude,
      start_date: this.toDatePayload(raw.start_date),
      end_date: this.toDatePayload(raw.end_date),
      budget: raw.budget || null,
      description: raw.description || null,
      image: this.selectedImage,
    });
  }

  private toDateValue(value: string | null): Date | null {
    return value ? new Date(`${value}T00:00:00`) : null;
  }

  private toDatePayload(value: Date | string | null | undefined): string | null {
    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      return value.slice(0, 10);
    }

    const offsetDate = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 10);
  }

  private tripDatesValidator(control: AbstractControl): ValidationErrors | null {
    const start = this.normalizeDate(control.get('start_date')?.value);
    const end = this.normalizeDate(control.get('end_date')?.value);

    if (start && start < this.today) {
      return { startDatePast: true };
    }

    if (end && end < this.today) {
      return { endDatePast: true };
    }

    if (start && end && end < start) {
      return { endBeforeStart: true };
    }

    return null;
  }

  private normalizeDate(value: Date | string | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    const date = typeof value === 'string' ? new Date(`${value.slice(0, 10)}T00:00:00`) : value;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private cityOnlySuggestions(query: string, results: CityResult[]): CityResult[] {
    const normalizedQuery = query.toLowerCase();
    const curated = curatedCities.filter((city) => `${city.name} ${city.country}`.toLowerCase().includes(normalizedQuery));
    const cities = results.filter((item) => item.type === 'city' && item.latitude !== null && item.longitude !== null);
    const seen = new Set<string>();

    return [...curated, ...cities].filter((city) => {
      const key = `${city.name}-${city.country}`.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    }).slice(0, 8);
  }

}
