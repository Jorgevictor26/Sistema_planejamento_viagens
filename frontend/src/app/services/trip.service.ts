import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/models/auth.models';
import { CityResult } from './location.service';

export interface Trip {
  id: number;
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

  list(filters: Record<string, string | number | null> = {}): Observable<ApiResponse<unknown>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        params = params.set(key, value);
      }
    });

    return this.http.get<ApiResponse<unknown>>(`${environment.apiUrl}/trips`, { params });
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
    const form = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, value instanceof File ? value : String(value));
      }
    });

    return this.http.post<ApiResponse<Trip>>(`${environment.apiUrl}/trips`, form);
  }

  update(id: number, payload: Partial<TripPayload>): Observable<ApiResponse<Trip>> {
    const form = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, value instanceof File ? value : String(value));
      }
    });

    form.append('_method', 'PUT');

    return this.http.post<ApiResponse<Trip>>(`${environment.apiUrl}/trips/${id}`, form);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/trips/${id}`);
  }
}
