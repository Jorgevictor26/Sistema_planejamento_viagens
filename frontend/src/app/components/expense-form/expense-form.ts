import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Expense, ExpenseCategory, ExpensePayload, expenseCategories } from '../../services/expense.service';
import { Trip } from '../../services/trip.service';

@Component({
  selector: 'app-expense-form',
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.scss',
})
export class ExpenseForm {
  private readonly fb = inject(FormBuilder);

  readonly trips = input.required<Trip[]>();
  readonly expense = input<Expense | null>(null);
  readonly loading = input(false);
  readonly submitted = output<ExpensePayload>();
  readonly cancelled = output<void>();

  readonly categories = expenseCategories;

  readonly form = this.fb.nonNullable.group({
    trip_id: [0, [Validators.required, Validators.min(1)]],
    category: ['hotel' as ExpenseCategory, [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0)]],
    description: [''],
    expense_date: [''],
  });

  constructor() {
    effect(() => {
      const expense = this.expense();

      if (!expense) {
        return;
      }

      this.form.patchValue({
        trip_id: expense.trip_id,
        category: expense.category,
        amount: Number(expense.amount),
        description: expense.description || '',
        expense_date: expense.expense_date ? expense.expense_date.slice(0, 10) : '',
      });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    this.submitted.emit({
      trip_id: Number(raw.trip_id),
      category: raw.category,
      amount: Number(raw.amount),
      description: raw.description || null,
      expense_date: raw.expense_date || null,
    });

    if (!this.expense()) {
      this.form.patchValue({
        amount: 0,
        description: '',
        expense_date: '',
      });
    }
  }
}
