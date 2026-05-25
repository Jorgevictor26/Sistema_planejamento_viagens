import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiResponse, AuthData, LoginPayload, RegisterPayload, User } from '../core/models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenKey = 'travel_planner_token';

  readonly currentUser = signal<User | null>(null);

  login(payload: LoginPayload): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${environment.apiUrl}/login`, payload).pipe(
      tap((response) => this.persistSession(response.data)),
    );
  }

  register(payload: RegisterPayload): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${environment.apiUrl}/register`, payload).pipe(
      tap((response) => this.persistSession(response.data)),
    );
  }

  forgotPassword(email: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${environment.apiUrl}/forgot-password`, { email });
  }

  me(): Observable<ApiResponse<{ user: User }>> {
    return this.http.get<ApiResponse<{ user: User }>>(`${environment.apiUrl}/me`).pipe(
      tap((response) => this.currentUser.set(response.data.user)),
    );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/logout`, {}).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return Boolean(this.token());
  }

  private persistSession(data: AuthData): void {
    localStorage.setItem(this.tokenKey, data.authorization.token);
    this.currentUser.set(data.user);
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    void this.router.navigate(['/login']);
  }
}
