import { Component, inject, input } from '@angular/core';

import { DashboardStats } from '../../services/dashboard.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-stats-cards',
  templateUrl: './stats-cards.html',
  styleUrl: './stats-cards.scss',
})
export class StatsCards {
  readonly currency = inject(CurrencyService);
  readonly stats = input<DashboardStats | null>(null);
  readonly favoritesCount = input(0);
}
