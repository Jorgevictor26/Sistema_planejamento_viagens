import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { Expense } from '../../services/expense.service';

@Component({
  selector: 'app-expense-table',
  imports: [CurrencyPipe, DatePipe, MatButtonModule],
  templateUrl: './expense-table.html',
  styleUrl: './expense-table.scss',
})
export class ExpenseTable {
  readonly expenses = input.required<Expense[]>();
  readonly loading = input(false);
  readonly edited = output<Expense>();
  readonly removed = output<number>();
}
