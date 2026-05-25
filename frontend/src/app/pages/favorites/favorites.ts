import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FavoriteList } from '../../components/favorite-list/favorite-list';
import { Navbar } from '../../components/navbar/navbar';
import { Favorite, FavoritePayload, FavoriteService, favoriteTypes } from '../../services/favorite.service';

@Component({
  selector: 'app-favorites-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    Navbar,
    FavoriteList,
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class FavoritesPage {
  private readonly fb = inject(FormBuilder);
  private readonly favoritesService = inject(FavoriteService);

  readonly types = favoriteTypes;
  readonly favorites = signal<Favorite[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    type: ['destino' as FavoritePayload['type'], [Validators.required]],
    location: [''],
    image: [''],
  });

  constructor() {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.loading.set(true);
    this.error.set('');

    this.favoritesService.list().subscribe({
      next: (response) => this.favorites.set(response.data),
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel carregar favoritos.'),
      complete: () => this.loading.set(false),
    });
  }

  saveFavorite(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.saving.set(true);
    this.error.set('');

    this.favoritesService.create({
      title: raw.title,
      type: raw.type,
      location: raw.location || null,
      image: raw.image || null,
    }).subscribe({
      next: () => {
        this.form.reset({
          title: '',
          type: 'destino',
          location: '',
          image: '',
        });
        this.loadFavorites();
      },
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel salvar favorito.'),
      complete: () => this.saving.set(false),
    });
  }

  deleteFavorite(id: number): void {
    if (!confirm('Remover este favorito?')) {
      return;
    }

    this.favoritesService.delete(id).subscribe({
      next: () => this.loadFavorites(),
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel remover favorito.'),
    });
  }
}
