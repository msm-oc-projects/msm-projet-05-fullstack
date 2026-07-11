import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { TopicComponent } from './topic.component';
import { TopicService } from './topic.service';

describe('TopicComponent', () => {
  let fixture: ComponentFixture<TopicComponent>;
  let topicService: jasmine.SpyObj<TopicService>;

  beforeEach(async () => {
    topicService = jasmine.createSpyObj<TopicService>('TopicService', ['getTopics']);

    await TestBed.configureTestingModule({
      declarations: [TopicComponent],
      providers: [{ provide: TopicService, useValue: topicService }]
    }).compileComponents();
  });

  it('should display topics returned by the API', () => {
    topicService.getTopics.and.returnValue(of([
      { id: 1, name: 'Angular', description: 'Framework frontend.' },
      { id: 2, name: 'Java', description: 'Langage et écosystème.' }
    ]));

    fixture = TestBed.createComponent(TopicComponent);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.topic-card');
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toContain('Angular');
    expect(fixture.componentInstance.loading()).toBeFalse();
  });

  it('should display an accessible error when the API fails', () => {
    topicService.getTopics.and.returnValue(throwError(() => new Error('network error')));

    fixture = TestBed.createComponent(TopicComponent);
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert.textContent).toContain('temporairement indisponibles');
    expect(fixture.componentInstance.loading()).toBeFalse();
  });
});
