import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/models/auth.models';

export interface CityResult {
  type: 'city' | 'country';
  id: number | string | null;
  name: string | null;
  city: string | null;
  country: string | null;
  country_code: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  population: number | null;
}

export interface WeatherResult {
  city: string | null;
  country: string | null;
  coordinates: {
    lat: number;
    lon: number;
  };
  temperature: number | null;
  feels_like: number | null;
  humidity: number | null;
  wind_speed: number | null;
  description: string | null;
  icon: string | null;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly http = inject(HttpClient);

  searchDestinations(query: string): Observable<ApiResponse<CityResult[]>> {
    const params = new HttpParams().set('q', query);

    return this.http.get<ApiResponse<CityResult[]>>(`${environment.apiUrl}/cities/search`, { params });
  }

  weather(lat: number, lon: number): Observable<ApiResponse<WeatherResult>> {
    const params = new HttpParams().set('lat', lat).set('lon', lon);

    return this.http.get<ApiResponse<WeatherResult>>(`${environment.apiUrl}/weather`, { params });
  }
}
