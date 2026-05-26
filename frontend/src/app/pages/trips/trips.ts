import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { TripList } from '../../components/trip-list/trip-list';
import { PaginatedTrips, Trip, TripService } from '../../services/trip.service';

@Component({
  selector: 'app-trips-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    TripList,
  ],
  templateUrl: './trips.html',
  styleUrl: './trips.scss',
})
export class TripsPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly tripService = inject(TripService);

  readonly trips = signal<Trip[]>([]);
  readonly pagination = signal<PaginatedTrips | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly filters = this.fb.nonNullable.group({
    q: [''],
    country: [''],
    from: [null as Date | string | null],
    to: [null as Date | string | null],
    sort: ['created_at'],
    direction: ['desc'],
  });

  constructor() {
    const query = this.route.snapshot.queryParamMap.get('q') || '';
    this.filters.patchValue({ q: query });
    this.filters.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current)),
      takeUntilDestroyed(),
    ).subscribe(() => this.load());
    this.load();
  }

  load(page = 1): void {
    this.loading.set(true);
    this.error.set('');

    this.tripService.list({ ...this.filterPayload(), page }).subscribe({
      next: (response) => {
        this.pagination.set(response.data);
        this.trips.set(this.uniqueTrips(response.data.data));
      },
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel carregar as viagens.'),
      complete: () => this.loading.set(false),
    });
  }

  clearFilters(): void {
    this.filters.reset({
      q: '',
      country: '',
      from: null,
      to: null,
      sort: 'created_at',
      direction: 'desc',
    }, { emitEvent: false });
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

  private filterPayload(): Record<string, string | number | null> {
    const raw = this.filters.getRawValue();

    return {
      ...raw,
      from: this.toDatePayload(raw.from),
      to: this.toDatePayload(raw.to),
    };
  }

  private toDatePayload(value: Date | string | null): string | null {
    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      return value.slice(0, 10);
    }

    const offsetDate = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 10);
  }

  private uniqueTrips(trips: Trip[]): Trip[] {
    return Array.from(new Map(trips.map((trip) => [trip.id, trip])).values());
  }
}
