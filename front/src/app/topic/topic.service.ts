import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Topic } from './topic.model';

@Injectable({ providedIn: 'root' })
export class TopicService {
  private readonly http = inject(HttpClient);

  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${environment.apiUrl}/topics`);
  }

  subscribe(topicId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/topics/${topicId}/subscription`, {});
  }

  unsubscribe(topicId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/topics/${topicId}/subscription`);
  }
}
