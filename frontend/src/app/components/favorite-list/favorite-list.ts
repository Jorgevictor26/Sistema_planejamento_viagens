import { Component, input, output } from '@angular/core';

import { Favorite } from '../../services/favorite.service';
import { FavoriteCard } from '../favorite-card/favorite-card';

@Component({
  selector: 'app-favorite-list',
  imports: [FavoriteCard],
  templateUrl: './favorite-list.html',
  styleUrl: './favorite-list.scss',
})
export class FavoriteList {
  readonly favorites = input.required<Favorite[]>();
  readonly loading = input(false);
  readonly removed = output<number>();
}
