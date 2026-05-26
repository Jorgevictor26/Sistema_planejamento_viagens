import { formatDate } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TripForm } from '../../components/trip-form/trip-form';
import { TripMap } from '../../components/trip-map/trip-map';
import { WeatherWidget } from '../../components/weather-widget/weather-widget';
import { CurrencyService } from '../../services/currency.service';
import { FavoriteService, FavoriteType } from '../../services/favorite.service';
import { CityResult, LocationService, PlaceResult } from '../../services/location.service';
import { Trip, TripPayload, TripService } from '../../services/trip.service';

@Component({
  selector: 'app-trip-details-page',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
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
  private readonly locations = inject(LocationService);
  private readonly favorites = inject(FavoriteService);
  readonly currency = inject(CurrencyService);

  readonly trip = signal<Trip | null>(null);
  readonly places = signal<PlaceResult[]>([]);
  readonly placesLoading = signal(false);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly error = signal('');
  readonly favoriteMessage = signal('');

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

  travelPeriod(): string {
    const trip = this.trip();

    if (!trip) {
      return 'Sem datas definidas';
    }

    if (trip.start_date && trip.end_date) {
      if (trip.start_date === trip.end_date) {
        return this.formatTripDate(trip.start_date);
      }

      return `${this.formatTripDate(trip.start_date)} - ${this.formatTripDate(trip.end_date)}`;
    }

    if (trip.start_date) {
      return `A partir de ${this.formatTripDate(trip.start_date)}`;
    }

    if (trip.end_date) {
      return `Até ${this.formatTripDate(trip.end_date)}`;
    }

    return 'Sem datas definidas';
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
      next: (response) => {
        this.trip.set(response.data);
        this.loadPlaces(response.data);
      },
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

  savePlace(place: PlaceResult): void {
    const trip = this.trip();
    const category = (place.category || '').toLowerCase();
    const type: FavoriteType = category.includes('hotel')
      ? 'hotel'
      : category.includes('restaurant') || category.includes('café') || category.includes('cafe')
        ? 'restaurante'
        : 'atração';

    this.favoriteMessage.set('');

    this.favorites.create({
      title: place.name || 'Local favorito',
      type,
      location: [place.address, trip?.destination_city, trip?.destination_country].filter(Boolean).join(', '),
      image: place.image,
    }).subscribe({
      next: () => this.favoriteMessage.set('Favorito salvo nesta viagem.'),
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel salvar favorito.'),
    });
  }

  private loadPlaces(trip: Trip): void {
    this.placesLoading.set(true);

    this.locations.nearbyPlaces(trip.latitude, trip.longitude).subscribe({
      next: (response) => this.places.set(this.uniquePlaces(response.data)),
      error: () => this.places.set([]),
      complete: () => this.placesLoading.set(false),
    });
  }

  private formatTripDate(value: string): string {
    return formatDate(value, 'dd/MM/yyyy', 'en-US');
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
