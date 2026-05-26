import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ItineraryForm } from '../../components/itinerary-form/itinerary-form';
import { ItineraryList } from '../../components/itinerary-list/itinerary-list';
import { Timeline } from '../../components/timeline/timeline';
import { Itinerary, ItineraryPayload, ItineraryService, PaginatedItineraries } from '../../services/itinerary.service';
import { NonNegativeNumberDirective } from '../../shared/non-negative-number.directive';
import { Trip, TripService } from '../../services/trip.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-itinerary-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NonNegativeNumberDirective,
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
  readonly totalDays = computed(() => new Set(this.items().map((item) => item.day)).size);
  readonly scheduledItems = computed(() => this.items().filter((item) => item.time).length);

  readonly filters = this.fb.nonNullable.group({
    trip_id: [''],
    day: ['', [Validators.min(1)]],
    q: [''],
  });

  constructor() {
    this.filters.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current)),
      takeUntilDestroyed(),
    ).subscribe(() => this.loadItineraries());
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
    if (this.filters.invalid) {
      this.filters.markAllAsTouched();
      return;
    }

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
    }, { emitEvent: false });
    this.loadItineraries();
  }
}
