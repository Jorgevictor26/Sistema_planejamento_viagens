import { formatDate } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TripForm } from '../../components/trip-form/trip-form';
import { TripMap } from '../../components/trip-map/trip-map';
import { WeatherWidget } from '../../components/weather-widget/weather-widget';
import { CurrencyService } from '../../services/currency.service';
import { FavoriteService, FavoriteType } from '../../services/favorite.service';
import { Itinerary, ItineraryService } from '../../services/itinerary.service';
import { CityResult, LocationService, PlaceResult } from '../../services/location.service';
import { NonNegativeNumberDirective } from '../../shared/non-negative-number.directive';
import { Trip, TripPayload, TripService } from '../../services/trip.service';

@Component({
  selector: 'app-trip-details-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    NonNegativeNumberDirective,
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
  private readonly itineraries = inject(ItineraryService);
  private readonly fb = inject(FormBuilder);
  readonly currency = inject(CurrencyService);

  readonly trip = signal<Trip | null>(null);
  readonly places = signal<PlaceResult[]>([]);
  readonly itineraryItems = signal<Itinerary[]>([]);
  readonly placesLoading = signal(false);
  readonly itineraryLoading = signal(false);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly error = signal('');
  readonly favoriteMessage = signal('');
  readonly itineraryMessage = signal('');
  readonly itinerarySaving = signal(false);
  readonly selectedPlace = signal<PlaceResult | null>(null);

  readonly itineraryForm = this.fb.nonNullable.group({
    day: [1, [Validators.required, Validators.min(1)]],
    time: ['09:00'],
    note: [''],
  });

  readonly hotelSuggestions = computed(() => this.places()
    .filter((place) => (place.category || '').toLowerCase().includes('hotel'))
    .slice(0, 3));

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
        this.loadItineraries(response.data.id);
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

  openItineraryModal(place: PlaceResult): void {
    this.selectedPlace.set(place);
    this.itineraryMessage.set('');
    this.itineraryForm.reset({
      day: 1,
      time: this.suggestTime(place),
      note: '',
    });
  }

  closeItineraryModal(): void {
    if (this.itinerarySaving()) {
      return;
    }

    this.selectedPlace.set(null);
  }

  addPlaceToItinerary(): void {
    const trip = this.trip();
    const place = this.selectedPlace();

    if (!trip || !place) {
      return;
    }

    if (this.itineraryForm.invalid) {
      this.itineraryForm.markAllAsTouched();
      return;
    }

    const raw = this.itineraryForm.getRawValue();
    const details = [
      place.category,
      place.rating ? `Rating ${place.rating}/10` : null,
      place.distance ? `${place.distance} m` : null,
      raw.note,
    ].filter(Boolean).join(' | ');

    this.itinerarySaving.set(true);
    this.error.set('');
    this.itineraryMessage.set('');

    this.itineraries.create({
      trip_id: trip.id,
      day: Number(raw.day),
      activity: place.name || 'Visitar local',
      location: place.address || `${trip.destination_city}, ${trip.destination_country}`,
      time: raw.time || null,
      description: details || null,
    }).subscribe({
      next: () => {
        this.selectedPlace.set(null);
        this.itineraryMessage.set('Local adicionado ao roteiro.');
        this.loadItineraries(trip.id);
      },
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel adicionar ao roteiro.'),
      complete: () => this.itinerarySaving.set(false),
    });
  }

  private loadPlaces(trip: Trip): void {
    this.placesLoading.set(true);

    this.locations.places(trip.latitude, trip.longitude, 'hotels').subscribe({
      next: (response) => this.places.set(this.uniquePlaces(response.data)),
      error: () => this.places.set([]),
      complete: () => this.placesLoading.set(false),
    });
  }

  private loadItineraries(tripId: number): void {
    this.itineraryLoading.set(true);

    this.itineraries.list({ trip_id: tripId, per_page: 50 }).subscribe({
      next: (response) => this.itineraryItems.set(response.data.data),
      error: () => this.itineraryItems.set([]),
      complete: () => this.itineraryLoading.set(false),
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

  private suggestTime(place: PlaceResult): string {
    const category = (place.category || '').toLowerCase();

    if (category.includes('restaurant') || category.includes('restaurante') || category.includes('cafe') || category.includes('café')) {
      return '12:00';
    }

    if (category.includes('hotel')) {
      return '15:00';
    }

    return '09:00';
  }
}
