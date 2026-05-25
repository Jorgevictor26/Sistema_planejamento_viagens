import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

import { Navbar } from '../../components/navbar/navbar';
import { TripForm } from '../../components/trip-form/trip-form';
import { TripPayload, TripService } from '../../services/trip.service';

@Component({
  selector: 'app-create-trip-page',
  imports: [RouterLink, MatButtonModule, Navbar, TripForm],
  templateUrl: './create-trip.html',
  styleUrl: './create-trip.scss',
})
export class CreateTripPage {
  private readonly trips = inject(TripService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal('');

  save(payload: TripPayload): void {
    this.loading.set(true);
    this.error.set('');

    this.trips.create(payload).subscribe({
      next: (response) => void this.router.navigate(['/trips', response.data.id]),
      error: (error) => {
        this.error.set(error.error?.message || 'Nao foi possivel criar a viagem.');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    void this.router.navigate(['/trips']);
  }
}
