import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/models/auth.models';
import { LanguageService } from './language.service';

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

export interface PlaceResult {
  id: string | null;
  name: string | null;
  category: string | null;
  rating: number | null;
  distance: number | null;
  address: string | null;
  image: string | null;
}

export type PlaceType = 'hotels' | 'restaurants' | 'services' | 'attractions';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly language = inject(LanguageService);

  searchDestinations(query: string): Observable<ApiResponse<CityResult[]>> {
    const params = new HttpParams().set('q', query);

    return this.http.get<ApiResponse<CityResult[]>>(`${environment.apiUrl}/cities/search`, { params });
  }

  weather(lat: number, lon: number): Observable<ApiResponse<WeatherResult>> {
    const params = new HttpParams().set('lat', lat).set('lon', lon);

    return this.http.get<ApiResponse<WeatherResult>>(`${environment.apiUrl}/weather`, { params });
  }

  nearbyPlaces(lat: number, lon: number): Observable<ApiResponse<PlaceResult[]>> {
    const params = new HttpParams().set('lat', lat).set('lon', lon).set('lang', this.language.language());

    return this.http.get<ApiResponse<PlaceResult[]>>(`${environment.apiUrl}/places/nearby`, { params });
  }

  places(lat: number, lon: number, type: PlaceType): Observable<ApiResponse<PlaceResult[]>> {
    const params = new HttpParams().set('lat', lat).set('lon', lon).set('type', type);

    return this.http.get<ApiResponse<PlaceResult[]>>(`${environment.apiUrl}/places`, { params });
  }
}
