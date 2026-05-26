import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/models/auth.models';
import { Trip } from './trip.service';

export interface PopularDestination {
  destination_city: string;
  destination_country: string;
  total: number;
}

export interface MonthlyExpense {
  month: string;
  total: string | number;
}

export interface DashboardStats {
  total_trips: number;
  total_spent: string | number;
  popular_destinations: PopularDestination[];
}

export interface ExpensesSummary {
  total_spent: string | number;
  monthly_expenses: MonthlyExpense[];
  popular_destinations: PopularDestination[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  stats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${environment.apiUrl}/dashboard/stats`);
  }

  recentTrips(): Observable<ApiResponse<Trip[]>> {
    return this.http.get<ApiResponse<Trip[]>>(`${environment.apiUrl}/dashboard/recent-trips`);
  }

  expensesSummary(): Observable<ApiResponse<ExpensesSummary>> {
    return this.http.get<ApiResponse<ExpensesSummary>>(`${environment.apiUrl}/dashboard/expenses-summary`);
  }
}
