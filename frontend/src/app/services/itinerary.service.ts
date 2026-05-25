import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/models/auth.models';
import { Trip } from './trip.service';

export const activityExamples = ['hotel', 'restaurante', 'museu', 'praia', 'transporte'] as const;

export interface Itinerary {
  id: number;
  trip_id: number;
  day: number;
  activity: string;
  location: string | null;
  time: string | null;
  description: string | null;
  trip?: Pick<Trip, 'id' | 'destination_city' | 'destination_country'>;
  created_at: string;
  updated_at: string;
}

export interface ItineraryPayload {
  trip_id: number;
  day: number;
  activity: string;
  location?: string | null;
  time?: string | null;
  description?: string | null;
}

export interface PaginatedItineraries {
  current_page: number;
  data: Itinerary[];
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
export class ItineraryService {
  private readonly http = inject(HttpClient);

  list(filters: Record<string, string | number | null> = {}): Observable<ApiResponse<PaginatedItineraries>> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<ApiResponse<PaginatedItineraries>>(`${environment.apiUrl}/itineraries`, { params });
  }

  create(payload: ItineraryPayload): Observable<ApiResponse<Itinerary>> {
    return this.http.post<ApiResponse<Itinerary>>(`${environment.apiUrl}/itineraries`, payload);
  }

  update(id: number, payload: Partial<ItineraryPayload>): Observable<ApiResponse<Itinerary>> {
    return this.http.put<ApiResponse<Itinerary>>(`${environment.apiUrl}/itineraries/${id}`, payload);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/itineraries/${id}`);
  }
}
