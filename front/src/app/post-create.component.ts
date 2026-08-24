import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ArticleService } from './article.service';
import { Topic } from './topic/topic.model';
import { TopicService } from './topic/topic.service';

@Component({ selector: 'app-post-create', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main class="page editor-page">
    <button type="button" class="back-link" (click)="router.navigate(['/articles'])"><span aria-hidden="true">←</span> Retour</button>
    <section class="editor-panel"><h1>Créer un article</h1><form class="editor-form" [formGroup]="form" (ngSubmit)="submit()">
      <label class="form-field"><span>Thème</span><select formControlName="topicId"><option value="">Sélectionner un thème</option>
        @for (topic of topics(); track topic.id) { <option [value]="topic.id">{{ topic.name }}</option> }</select></label>
      <label class="form-field"><span>Titre de l'article</span><input formControlName="title" maxlength="255"></label>
      <label class="form-field"><span>Contenu de l'article</span><textarea formControlName="content" rows="10"></textarea></label>
      <button type="submit" class="primary-action editor-submit" [disabled]="form.invalid">Créer</button>
      @if (error()) { <p role="alert" class="error">{{ error() }}</p> }
    </form></section></main>` })
export class PostCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder); private readonly topicsService = inject(TopicService);
  private readonly articles = inject(ArticleService); readonly router = inject(Router);
  readonly topics = signal<Topic[]>([]); readonly error = signal('');
  readonly form = this.fb.group({ topicId: ['', Validators.required], title: ['', Validators.required], content: ['', Validators.required] });
  ngOnInit(): void { this.topicsService.getTopics().subscribe({
    next: topics => this.topics.set(topics),
    error: event => this.error.set(event.error?.message ?? 'Impossible de charger les thèmes.')
  }); }
  submit(): void { const value = this.form.getRawValue(); this.articles.create(Number(value.topicId), value.title!, value.content!).subscribe({
    next: article => this.router.navigate(['/articles', article.id]),
    error: event => this.error.set(event.error?.message ?? "Impossible de créer l'article.") }); }
}
