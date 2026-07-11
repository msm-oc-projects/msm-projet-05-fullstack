import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Topic } from './topic/topic.model';

export interface Profile {
  id: number;
  email: string;
  username: string;
  subscriptions: Topic[];
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);

  get(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.apiUrl}/me`);
  }

  update(email: string, username: string, password?: string): Observable<Profile> {
    return this.http.put<Profile>(`${environment.apiUrl}/me`, { email, username, password: password || null });
  }
}
