import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

export interface ArticleSummary {
  id: number;
  title: string;
  content: string;
  author: string;
  topic: string;
  createdAt: string;
}

export interface ArticleComment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
}

export interface ArticleDetail extends ArticleSummary {
  comments: ArticleComment[];
}

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly http = inject(HttpClient);

  feed(sort: 'asc' | 'desc'): Observable<ArticleSummary[]> {
    return this.http.get<ArticleSummary[]>(`${environment.apiUrl}/articles`, { params: { sort } });
  }

  create(topicId: number, title: string, content: string): Observable<ArticleSummary> {
    return this.http.post<ArticleSummary>(`${environment.apiUrl}/articles`, { topicId, title, content });
  }

  detail(id: number): Observable<ArticleDetail> {
    return this.http.get<ArticleDetail>(`${environment.apiUrl}/articles/${id}`);
  }

  comment(id: number, content: string): Observable<ArticleComment> {
    return this.http.post<ArticleComment>(`${environment.apiUrl}/articles/${id}/comments`, { content });
  }
}
