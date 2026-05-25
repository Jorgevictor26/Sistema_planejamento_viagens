import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/models/auth.models';
import { Trip } from './trip.service';

export const expenseCategories = ['hotel', 'transporte', 'alimentação', 'compras', 'passeio'] as const;
export type ExpenseCategory = typeof expenseCategories[number];

export interface Expense {
  id: number;
  trip_id: number;
  category: ExpenseCategory;
  amount: string;
  description: string | null;
  expense_date: string | null;
  trip?: Pick<Trip, 'id' | 'destination_city' | 'destination_country'>;
  created_at: string;
  updated_at: string;
}

export interface ExpensePayload {
  trip_id: number;
  category: ExpenseCategory;
  amount: number;
  description?: string | null;
  expense_date?: string | null;
}

export interface PaginatedExpenses {
  current_page: number;
  data: Expense[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: unknown[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly http = inject(HttpClient);

  list(filters: Record<string, string | number | null> = {}): Observable<ApiResponse<PaginatedExpenses>> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<ApiResponse<PaginatedExpenses>>(`${environment.apiUrl}/expenses`, { params });
  }

  create(payload: ExpensePayload): Observable<ApiResponse<Expense>> {
    return this.http.post<ApiResponse<Expense>>(`${environment.apiUrl}/expenses`, payload);
  }

  update(id: number, payload: Partial<ExpensePayload>): Observable<ApiResponse<Expense>> {
    return this.http.put<ApiResponse<Expense>>(`${environment.apiUrl}/expenses/${id}`, payload);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/expenses/${id}`);
  }
}
