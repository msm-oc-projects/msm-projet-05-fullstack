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
}
