import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ArticleService } from './article.service';
import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { FeedComponent } from './feed.component';
import { PostCreateComponent } from './post-create.component';
import { PostDetailComponent } from './post-detail.component';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';
import { TopicService } from './topic/topic.service';

describe('Main components', () => {
  const router = jasmine.createSpyObj<Router>('Router', ['navigate']);

  it('should switch auth views, register and expose an API error', () => {
    const auth = jasmine.createSpyObj<AuthService>('AuthService', ['register', 'login']);
    auth.register.and.returnValue(of({ token: 'jwt', userId: 1, email: 'dev@example.com', username: 'dev' }));
    auth.login.and.returnValue(throwError(() => ({ error: { message: 'Identifiants invalides' } })));
    TestBed.configureTestingModule({ imports: [ReactiveFormsModule], declarations: [AuthComponent], providers: [
      { provide: AuthService, useValue: auth }, { provide: Router, useValue: router }
    ] });
    const fixture = TestBed.createComponent(AuthComponent);
    const component = fixture.componentInstance;
    component.show('register');
    component.registerForm.setValue({ email: 'dev@example.com', username: 'dev', password: 'Valid1!password' });
    component.register();
    expect(auth.register).toHaveBeenCalled();
    component.show('login');
    component.loginForm.setValue({ identifier: 'dev', password: 'bad' });
    component.login();
    expect(component.error()).toBe('Identifiants invalides');
  });

  it('should load, sort and open the feed', () => {
    const articles = jasmine.createSpyObj<ArticleService>('ArticleService', ['feed']);
    articles.feed.and.returnValue(of([]));
    TestBed.configureTestingModule({ imports: [CommonModule], declarations: [FeedComponent], providers: [
      { provide: ArticleService, useValue: articles }, { provide: Router, useValue: router }
    ] });
    const component = TestBed.createComponent(FeedComponent).componentInstance;
    component.ngOnInit();
    component.toggleSort();
    component.open(7);
    expect(articles.feed).toHaveBeenCalledTimes(2);
    expect(router.navigate).toHaveBeenCalledWith(['/articles', 7]);
  });

  it('should load topics and create an article', () => {
    const topics = jasmine.createSpyObj<TopicService>('TopicService', ['getTopics']);
    topics.getTopics.and.returnValue(of([{ id: 2, name: 'Java', description: 'Java', subscribed: true }]));
    const articles = jasmine.createSpyObj<ArticleService>('ArticleService', ['create']);
    articles.create.and.returnValue(of({ id: 9, title: 'Titre', content: 'Contenu', author: 'dev', topic: 'Java', createdAt: '' }));
    TestBed.configureTestingModule({ imports: [ReactiveFormsModule], declarations: [PostCreateComponent], providers: [
      { provide: TopicService, useValue: topics }, { provide: ArticleService, useValue: articles }, { provide: Router, useValue: router }
    ] });
    const component = TestBed.createComponent(PostCreateComponent).componentInstance;
    component.ngOnInit();
    component.form.setValue({ topicId: '2', title: 'Titre', content: 'Contenu' });
    component.submit();
    expect(articles.create).toHaveBeenCalledWith(2, 'Titre', 'Contenu');
  });

  it('should load an article and add a comment', () => {
    const articles = jasmine.createSpyObj<ArticleService>('ArticleService', ['detail', 'comment']);
    articles.detail.and.returnValue(of({ id: 4, title: 'Titre', content: 'Texte', author: 'dev', topic: 'Java', createdAt: '', comments: [] }));
    articles.comment.and.returnValue(of({ id: 5, content: 'Merci', author: 'dev', createdAt: '' }));
    TestBed.configureTestingModule({ imports: [CommonModule, ReactiveFormsModule], declarations: [PostDetailComponent], providers: [
      { provide: ArticleService, useValue: articles },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '4' } } } }
    ] });
    const component = TestBed.createComponent(PostDetailComponent).componentInstance;
    component.ngOnInit();
    component.content.setValue('Merci');
    component.submit();
    expect(articles.comment).toHaveBeenCalledWith(4, 'Merci');
    expect(articles.detail).toHaveBeenCalledTimes(2);
  });

  it('should update the profile and unsubscribe', () => {
    const profile = { id: 1, email: 'dev@example.com', username: 'dev', subscriptions: [] };
    const profiles = jasmine.createSpyObj<ProfileService>('ProfileService', ['get', 'update']);
    profiles.get.and.returnValue(of(profile));
    profiles.update.and.returnValue(of(profile));
    const topics = jasmine.createSpyObj<TopicService>('TopicService', ['unsubscribe']);
    topics.unsubscribe.and.returnValue(of(undefined));
    TestBed.configureTestingModule({ imports: [ReactiveFormsModule], declarations: [ProfileComponent], providers: [
      { provide: ProfileService, useValue: profiles }, { provide: TopicService, useValue: topics }
    ] });
    const component = TestBed.createComponent(ProfileComponent).componentInstance;
    component.ngOnInit();
    component.save();
    component.unsubscribe(3);
    expect(profiles.update).toHaveBeenCalled();
    expect(topics.unsubscribe).toHaveBeenCalledWith(3);
  });
});
