import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';

import { Navbar } from '../../components/navbar/navbar';
import { TripList } from '../../components/trip-list/trip-list';
import { PaginatedTrips, Trip, TripService } from '../../services/trip.service';

@Component({
  selector: 'app-trips-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    Navbar,
    TripList,
  ],
  templateUrl: './trips.html',
  styleUrl: './trips.scss',
})
export class TripsPage {
  private readonly fb = inject(FormBuilder);
  private readonly tripService = inject(TripService);

  readonly trips = signal<Trip[]>([]);
  readonly pagination = signal<PaginatedTrips | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly filters = this.fb.nonNullable.group({
    q: [''],
    country: [''],
    from: [''],
    to: [''],
    sort: ['created_at'],
    direction: ['desc'],
  });

  constructor() {
    this.load();
  }

  load(page = 1): void {
    this.loading.set(true);
    this.error.set('');

    this.tripService.list({ ...this.filters.getRawValue(), page }).subscribe({
      next: (response) => {
        this.pagination.set(response.data);
        this.trips.set(response.data.data);
      },
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel carregar as viagens.'),
      complete: () => this.loading.set(false),
    });
  }

  clearFilters(): void {
    this.filters.reset({
      q: '',
      country: '',
      from: '',
      to: '',
      sort: 'created_at',
      direction: 'desc',
    });
    this.load();
  }

  deleteTrip(id: number): void {
    if (!confirm('Excluir esta viagem?')) {
      return;
    }

    this.tripService.delete(id).subscribe({
      next: () => this.load(this.pagination()?.current_page || 1),
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel excluir a viagem.'),
    });
  }
}
