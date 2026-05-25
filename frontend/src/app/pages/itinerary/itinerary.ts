import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ItineraryForm } from '../../components/itinerary-form/itinerary-form';
import { ItineraryList } from '../../components/itinerary-list/itinerary-list';
import { Navbar } from '../../components/navbar/navbar';
import { Timeline } from '../../components/timeline/timeline';
import { Itinerary, ItineraryPayload, ItineraryService, PaginatedItineraries } from '../../services/itinerary.service';
import { Trip, TripService } from '../../services/trip.service';

@Component({
  selector: 'app-itinerary-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    Navbar,
    ItineraryForm,
    ItineraryList,
    Timeline,
  ],
  templateUrl: './itinerary.html',
  styleUrl: './itinerary.scss',
})
export class ItineraryPage {
  private readonly fb = inject(FormBuilder);
  private readonly itineraries = inject(ItineraryService);
  private readonly tripsService = inject(TripService);

  readonly trips = signal<Trip[]>([]);
  readonly items = signal<Itinerary[]>([]);
  readonly pagination = signal<PaginatedItineraries | null>(null);
  readonly editing = signal<Itinerary | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');

  readonly filters = this.fb.nonNullable.group({
    trip_id: [''],
    day: [''],
    q: [''],
  });

  constructor() {
    this.loadTrips();
    this.loadItineraries();
  }

  loadTrips(): void {
    this.tripsService.list({ per_page: 50, sort: 'destination_city', direction: 'asc' }).subscribe({
      next: (response) => this.trips.set(response.data.data),
      error: () => this.error.set('Nao foi possivel carregar as viagens para o roteiro.'),
    });
  }

  loadItineraries(page = 1): void {
    this.loading.set(true);
    this.error.set('');

    this.itineraries.list({ ...this.filters.getRawValue(), page, per_page: 50 }).subscribe({
      next: (response) => {
        this.pagination.set(response.data);
        this.items.set(response.data.data);
      },
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel carregar o roteiro.'),
      complete: () => this.loading.set(false),
    });
  }

  save(payload: ItineraryPayload): void {
    const editing = this.editing();
    this.saving.set(true);
    this.error.set('');

    const request = editing
      ? this.itineraries.update(editing.id, payload)
      : this.itineraries.create(payload);

    request.subscribe({
      next: () => {
        this.editing.set(null);
        this.loadItineraries(this.pagination()?.current_page || 1);
      },
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel salvar a atividade.'),
      complete: () => this.saving.set(false),
    });
  }

  deleteItinerary(id: number): void {
    if (!confirm('Remover esta atividade do roteiro?')) {
      return;
    }

    this.itineraries.delete(id).subscribe({
      next: () => this.loadItineraries(this.pagination()?.current_page || 1),
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel remover a atividade.'),
    });
  }

  clearFilters(): void {
    this.filters.reset({
      trip_id: '',
      day: '',
      q: '',
    });
    this.loadItineraries();
  }
}
