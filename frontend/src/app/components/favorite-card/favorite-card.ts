import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Favorite } from '../../services/favorite.service';

@Component({
  selector: 'app-favorite-card',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './favorite-card.html',
  styleUrl: './favorite-card.scss',
})
export class FavoriteCard {
  readonly favorite = input.required<Favorite>();
  readonly removed = output<number>();
}
