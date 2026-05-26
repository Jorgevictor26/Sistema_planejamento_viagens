import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

import { TripForm } from '../../components/trip-form/trip-form';
import { TripPayload, TripService } from '../../services/trip.service';

@Component({
  selector: 'app-create-trip-page',
  imports: [RouterLink, MatButtonModule, TripForm],
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
        const details = error.error?.errors
          ? Object.values(error.error.errors).flat().join(' ')
          : '';

        this.error.set(details || error.error?.message || 'Nao foi possivel criar a viagem. Confira os campos obrigatorios e tente novamente.');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    void this.router.navigate(['/trips']);
  }
}
