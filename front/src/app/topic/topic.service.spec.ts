import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../environments/environment';
import { TopicService } from './topic.service';

describe('TopicService', () => {
  let service: TopicService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TopicService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TopicService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should request topics from the backend API', () => {
    const response = [{ id: 1, name: 'Angular', description: 'Framework frontend.', subscribed: false }];

    service.getTopics().subscribe(topics => expect(topics).toEqual(response));

    const request = httpTesting.expectOne(`${environment.apiUrl}/topics`);
    expect(request.request.method).toBe('GET');
    request.flush(response);
  });
});
