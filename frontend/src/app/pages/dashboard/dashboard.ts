import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { DashboardService, DashboardStats, ExpensesSummary } from '../../services/dashboard.service';
import { Expense, ExpenseCategory, ExpenseService } from '../../services/expense.service';
import { Favorite, FavoriteService } from '../../services/favorite.service';
import { Trip } from '../../services/trip.service';
import { ExportService } from '../../services/export.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    MatButtonModule,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage {
  private readonly dashboard = inject(DashboardService);
  private readonly expenses = inject(ExpenseService);
  private readonly exports = inject(ExportService);
  private readonly favoritesService = inject(FavoriteService);
  readonly currency = inject(CurrencyService);
  readonly auth = inject(AuthService);

  readonly stats = signal<DashboardStats | null>(null);
  readonly summary = signal<ExpensesSummary | null>(null);
  readonly recentTrips = signal<Trip[]>([]);
  readonly recentExpenses = signal<Expense[]>([]);
  readonly favorites = signal<Favorite[]>([]);
  readonly error = signal('');
  readonly loading = signal(false);
  readonly totalSpent = computed(() => Number(this.stats()?.total_spent ?? this.summary()?.total_spent ?? 0));
  readonly totalTrips = computed(() => Number(this.stats()?.total_trips ?? this.recentTrips().length));
  readonly plannedBudget = computed<number | null>(() => {
    const total = this.recentTrips().reduce((sum, trip) => sum + Number(trip.budget || 0), 0);

    return total > 0 ? total : null;
  });
  readonly budgetProgress = computed(() => {
    const budget = this.plannedBudget();

    if (!budget) {
      return 0;
    }

    return Math.min(Math.round((this.totalSpent() / budget) * 100), 100);
  });
  readonly popularDestinations = computed(() => this.stats()?.popular_destinations || this.summary()?.popular_destinations || []);
  readonly upcomingTrips = computed(() => {
    const trips = [...this.recentTrips()];

    return trips.sort((a, b) => {
      if (!a.start_date) {
        return 1;
      }

      if (!b.start_date) {
        return -1;
      }

      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    }).slice(0, 4);
  });
  readonly expenseHighlights = computed(() => {
    const totals = new Map<ExpenseCategory, number>();

    this.recentExpenses().forEach((expense) => {
      totals.set(expense.category, (totals.get(expense.category) || 0) + Number(expense.amount));
    });

    return Array.from(totals.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);
  });

  constructor() {
    this.auth.me().subscribe();
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set('');

    this.dashboard.stats().subscribe({
      next: (response) => this.stats.set(response.data),
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel carregar estatisticas.'),
    });

    this.dashboard.expensesSummary().subscribe({
      next: (response) => this.summary.set(response.data),
    });

    this.dashboard.recentTrips().subscribe({
      next: (response) => this.recentTrips.set(response.data),
      complete: () => this.loading.set(false),
    });

    this.expenses.list({ per_page: 5 }).subscribe({
      next: (response) => this.recentExpenses.set(response.data.data),
    });

    this.favoritesService.list().subscribe({
      next: (response) => this.favorites.set(response.data),
    });
  }

  exportTrips(format: 'csv' | 'pdf'): void {
    this.exports.download('trips', format).subscribe();
  }

  exportExpenses(format: 'csv' | 'pdf'): void {
    this.exports.download('expenses', format).subscribe();
  }

  initials(): string {
    const name = this.auth.currentUser()?.name || 'Utilizador';
    return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  }

  currentMonthLabel(): string {
    return new Intl.DateTimeFormat('pt-AO', { month: 'long', year: 'numeric' }).format(new Date());
  }

  expenseIcon(category: string): string {
    const icons: Record<string, string> = {
      hotel: '⌂',
      transporte: '✈',
      alimentação: '◌',
      compras: '▣',
      passeio: '⌁',
    };

    return icons[category] || '¤';
  }

}
