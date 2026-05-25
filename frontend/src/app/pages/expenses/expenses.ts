import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ExpenseChart } from '../../components/expense-chart/expense-chart';
import { ExpenseForm } from '../../components/expense-form/expense-form';
import { ExpenseTable } from '../../components/expense-table/expense-table';
import { Navbar } from '../../components/navbar/navbar';
import { Expense, ExpensePayload, ExpenseService, expenseCategories, PaginatedExpenses } from '../../services/expense.service';
import { Trip, TripService } from '../../services/trip.service';

@Component({
  selector: 'app-expenses-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    Navbar,
    ExpenseChart,
    ExpenseForm,
    ExpenseTable,
  ],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss',
})
export class ExpensesPage {
  private readonly fb = inject(FormBuilder);
  private readonly expenses = inject(ExpenseService);
  private readonly tripsService = inject(TripService);

  readonly categories = expenseCategories;
  readonly trips = signal<Trip[]>([]);
  readonly items = signal<Expense[]>([]);
  readonly pagination = signal<PaginatedExpenses | null>(null);
  readonly editing = signal<Expense | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');

  readonly filters = this.fb.nonNullable.group({
    trip_id: [''],
    category: [''],
    from: [''],
    to: [''],
  });

  readonly selectedBudget = computed<number | null>(() => {
    const tripId = Number(this.filters.controls.trip_id.value);

    if (!tripId) {
      return null;
    }

    const trip = this.trips().find((item) => item.id === tripId);
    return trip?.budget ? Number(trip.budget) : null;
  });

  constructor() {
    this.loadTrips();
    this.loadExpenses();
  }

  loadTrips(): void {
    this.tripsService.list({ per_page: 50, sort: 'destination_city', direction: 'asc' }).subscribe({
      next: (response) => this.trips.set(response.data.data),
      error: () => this.error.set('Nao foi possivel carregar as viagens para despesas.'),
    });
  }

  loadExpenses(page = 1): void {
    this.loading.set(true);
    this.error.set('');

    this.expenses.list({ ...this.filters.getRawValue(), page, per_page: 50 }).subscribe({
      next: (response) => {
        this.pagination.set(response.data);
        this.items.set(response.data.data);
      },
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel carregar as despesas.'),
      complete: () => this.loading.set(false),
    });
  }

  save(payload: ExpensePayload): void {
    const editing = this.editing();
    this.saving.set(true);
    this.error.set('');

    const request = editing
      ? this.expenses.update(editing.id, payload)
      : this.expenses.create(payload);

    request.subscribe({
      next: () => {
        this.editing.set(null);
        this.loadExpenses(this.pagination()?.current_page || 1);
      },
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel salvar a despesa.'),
      complete: () => this.saving.set(false),
    });
  }

  deleteExpense(id: number): void {
    if (!confirm('Excluir esta despesa?')) {
      return;
    }

    this.expenses.delete(id).subscribe({
      next: () => this.loadExpenses(this.pagination()?.current_page || 1),
      error: (error) => this.error.set(error.error?.message || 'Nao foi possivel excluir a despesa.'),
    });
  }

  clearFilters(): void {
    this.filters.reset({
      trip_id: '',
      category: '',
      from: '',
      to: '',
    });
    this.loadExpenses();
  }
}
