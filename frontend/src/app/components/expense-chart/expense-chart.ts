import { Component, computed, inject, input } from '@angular/core';

import { Expense, expenseCategories } from '../../services/expense.service';
import { MonthlyExpense } from '../../services/dashboard.service';
import { CurrencyService } from '../../services/currency.service';

interface ChartRow {
  category: string;
  total: number;
  percent: number;
}

@Component({
  selector: 'app-expense-chart',
  templateUrl: './expense-chart.html',
  styleUrl: './expense-chart.scss',
})
export class ExpenseChart {
  readonly currency = inject(CurrencyService);
  readonly expenses = input.required<Expense[]>();
  readonly budget = input<number | null>(null);
  readonly monthlyExpenses = input<MonthlyExpense[]>([]);

  readonly total = computed(() => this.expenses().reduce((sum, expense) => sum + Number(expense.amount), 0));
  readonly remaining = computed(() => {
    const budget = this.budget();

    return budget === null ? null : budget - this.total();
  });

  readonly rows = computed<ChartRow[]>(() => {
    if (this.monthlyExpenses().length) {
      const max = Math.max(...this.monthlyExpenses().map((item) => Number(item.total)), 1);

      return this.monthlyExpenses().map((item) => ({
        category: item.month,
        total: Number(item.total),
        percent: Math.round((Number(item.total) / max) * 100),
      }));
    }

    if (!this.expenses().length) {
      return [];
    }

    const totals = new Map<string, number>();

    expenseCategories.forEach((category) => totals.set(category, 0));
    this.expenses().forEach((expense) => {
      totals.set(expense.category, (totals.get(expense.category) || 0) + Number(expense.amount));
    });

    const max = Math.max(...Array.from(totals.values()), 1);

    return Array.from(totals.entries()).map(([category, total]) => ({
      category,
      total,
      percent: Math.round((total / max) * 100),
    }));
  });
}
