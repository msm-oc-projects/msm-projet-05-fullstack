import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../environments/environment';

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenState = signal(localStorage.getItem('mdd_token'));
  readonly authenticated = computed(() => this.tokenState() !== null);

  register(email: string, username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { email, username, password })
      .pipe(tap(response => this.store(response.token)));
  }

  login(identifier: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { identifier, password })
      .pipe(tap(response => this.store(response.token)));
  }

  token(): string | null {
    return this.tokenState();
  }

  logout(): void {
    localStorage.removeItem('mdd_token');
    this.tokenState.set(null);
  }

  private store(token: string): void {
    localStorage.setItem('mdd_token', token);
    this.tokenState.set(token);
  }
}
