import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../environments/environment';
import { ArticleService } from './article.service';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';
import { TopicService } from './topic/topic.service';

describe('Main feature API services', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(), provideHttpClientTesting(), AuthService, ArticleService, ProfileService, TopicService
    ] });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should persist the token returned at login', () => {
    const service = TestBed.inject(AuthService);
    service.login('dev', 'Valid1!password').subscribe();
    http.expectOne(`${environment.apiUrl}/auth/login`).flush({ token: 'jwt', userId: 1, email: 'dev@example.com', username: 'dev' });
    expect(service.token()).toBe('jwt');
    expect(localStorage.getItem('mdd_token')).toBe('jwt');
  });

  it('should request the subscribed feed with the selected order', () => {
    TestBed.inject(ArticleService).feed('asc').subscribe();
    const request = http.expectOne(request => request.url === `${environment.apiUrl}/articles` && request.params.get('sort') === 'asc');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('should create an article and a comment without sending an author or date', () => {
    const service = TestBed.inject(ArticleService);
    service.create(2, 'Titre', 'Contenu').subscribe();
    const create = http.expectOne(`${environment.apiUrl}/articles`);
    expect(create.request.body).toEqual({ topicId: 2, title: 'Titre', content: 'Contenu' });
    create.flush({ id: 7 });

    service.comment(7, 'Commentaire').subscribe();
    const comment = http.expectOne(`${environment.apiUrl}/articles/7/comments`);
    expect(comment.request.body).toEqual({ content: 'Commentaire' });
    comment.flush({ id: 8 });
  });

  it('should subscribe, load the profile and unsubscribe', () => {
    const topics = TestBed.inject(TopicService);
    topics.subscribe(3).subscribe();
    http.expectOne(`${environment.apiUrl}/topics/3/subscription`).flush(null);

    TestBed.inject(ProfileService).get().subscribe();
    http.expectOne(`${environment.apiUrl}/me`).flush({ id: 1, email: 'dev@example.com', username: 'dev', subscriptions: [] });

    topics.unsubscribe(3).subscribe();
    const unsubscribe = http.expectOne(`${environment.apiUrl}/topics/3/subscription`);
    expect(unsubscribe.request.method).toBe('DELETE');
    unsubscribe.flush(null);
  });
});
