import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/models/auth.models';
import { CityResult } from './location.service';

export interface Trip {
  id: number;
  user_id?: number;
  destination_city: string;
  destination_country: string;
  latitude: number;
  longitude: number;
  start_date: string | null;
  end_date: string | null;
  budget: string | null;
  description: string | null;
  image: string | null;
  created_at: string;
}

export interface PaginatedTrips {
  current_page: number;
  data: Trip[];
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

export interface TripPayload {
  destination_city: string;
  destination_country: string;
  latitude: number;
  longitude: number;
  start_date?: string | null;
  end_date?: string | null;
  budget?: number | null;
  description?: string | null;
  image?: File | null;
}

@Injectable({ providedIn: 'root' })
export class TripService {
  private readonly http = inject(HttpClient);

  list(filters: Record<string, string | number | null> = {}): Observable<ApiResponse<PaginatedTrips>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<ApiResponse<PaginatedTrips>>(`${environment.apiUrl}/trips`, { params });
  }

  find(id: number): Observable<ApiResponse<Trip>> {
    return this.http.get<ApiResponse<Trip>>(`${environment.apiUrl}/trips/${id}`);
  }

  createFromCity(city: CityResult, extra: Partial<TripPayload> = {}): Observable<ApiResponse<Trip>> {
    const payload: TripPayload = {
      destination_city: city.name || '',
      destination_country: city.country || '',
      latitude: city.latitude || 0,
      longitude: city.longitude || 0,
      ...extra,
    };

    return this.create(payload);
  }

  create(payload: TripPayload): Observable<ApiResponse<Trip>> {
    return this.http.post<ApiResponse<Trip>>(`${environment.apiUrl}/trips`, this.toFormData(payload));
  }

  update(id: number, payload: Partial<TripPayload>): Observable<ApiResponse<Trip>> {
    const form = this.toFormData(payload);

    form.append('_method', 'PUT');

    return this.http.post<ApiResponse<Trip>>(`${environment.apiUrl}/trips/${id}`, form);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/trips/${id}`);
  }

  imageUrl(trip: Pick<Trip, 'image'>): string | null {
    if (!trip.image) {
      return null;
    }

    if (trip.image.startsWith('http')) {
      return trip.image;
    }

    return `${environment.apiUrl.replace('/api', '')}/storage/${trip.image}`;
  }

  private toFormData(payload: Partial<TripPayload>): FormData {
    const form = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, value instanceof File ? value : String(value));
      }
    });

    return form;
  }
}
