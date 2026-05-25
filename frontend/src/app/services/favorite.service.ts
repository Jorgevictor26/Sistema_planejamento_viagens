import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/models/auth.models';

export const favoriteTypes = ['destino', 'hotel', 'restaurante'] as const;
export type FavoriteType = typeof favoriteTypes[number];

export interface Favorite {
  id: number;
  user_id: number;
  title: string;
  type: FavoriteType;
  image: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface FavoritePayload {
  title: string;
  type: FavoriteType;
  image?: string | null;
  location?: string | null;
}

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly http = inject(HttpClient);

  list(): Observable<ApiResponse<Favorite[]>> {
    return this.http.get<ApiResponse<Favorite[]>>(`${environment.apiUrl}/favorites`);
  }

  create(payload: FavoritePayload): Observable<ApiResponse<Favorite>> {
    return this.http.post<ApiResponse<Favorite>>(`${environment.apiUrl}/favorites`, payload);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/favorites/${id}`);
  }
}
