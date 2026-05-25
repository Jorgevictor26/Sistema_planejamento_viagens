import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Navbar } from '../../components/navbar/navbar';
import { TripForm } from '../../components/trip-form/trip-form';
import { TripMap } from '../../components/trip-map/trip-map';
import { WeatherWidget } from '../../components/weather-widget/weather-widget';
import { CityResult } from '../../services/location.service';
import { Trip, TripPayload, TripService } from '../../services/trip.service';

@Component({
  selector: 'app-trip-details-page',
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    Navbar,
    TripForm,
    TripMap,
    WeatherWidget,
  ],
  templateUrl: './trip-details.html',
  styleUrl: './trip-details.scss',
})
export class TripDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly trips = inject(TripService);

  readonly trip = signal<Trip | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly error = signal('');

  readonly weatherDestination = computed<CityResult | null>(() => {
    const trip = this.trip();

    if (!trip) {
      return null;
    }

    return {
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
  });

  constructor() {
    this.load();
  }

  imageUrl(): string | null {
    const trip = this.trip();
    return trip ? this.trips.imageUrl(trip) : null;
  }

  load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      void this.router.navigate(['/trips']);
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.trips.find(id).subscribe({
      next: (response) => this.trip.set(response.data),
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel carregar a viagem.'),
      complete: () => this.loading.set(false),
    });
  }

  save(payload: TripPayload): void {
    const trip = this.trip();

    if (!trip) {
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.trips.update(trip.id, payload).subscribe({
      next: (response) => {
        this.trip.set(response.data);
        this.editing.set(false);
      },
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel atualizar a viagem.'),
      complete: () => this.saving.set(false),
    });
  }

  deleteTrip(): void {
    const trip = this.trip();

    if (!trip || !confirm('Excluir esta viagem?')) {
      return;
    }

    this.trips.delete(trip.id).subscribe({
      next: () => void this.router.navigate(['/trips']),
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel excluir a viagem.'),
    });
  }
}
