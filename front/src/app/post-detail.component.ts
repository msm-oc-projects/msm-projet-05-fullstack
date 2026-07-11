import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ArticleDetail, ArticleService } from './article.service';

@Component({ selector: 'app-post-detail', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main>@if (article(); as item) {
    <article><h1>{{ item.title }}</h1><p>{{ item.createdAt | date:'dd/MM/yyyy' }} · {{ item.author }} · {{ item.topic }}</p><p>{{ item.content }}</p></article>
    <h2>Commentaires</h2>@for (comment of item.comments; track comment.id) {
      <article class="comment"><strong>{{ comment.author }}</strong><p>{{ comment.content }}</p></article>
    } @empty { <p>Aucun commentaire.</p> }
    <form (ngSubmit)="submit()"><label>Ajouter un commentaire<textarea [formControl]="content"></textarea></label>
      <button type="submit" [disabled]="content.invalid">Envoyer</button></form>
  } @if (error()) { <p role="alert" class="error">{{ error() }}</p> }</main>` })
export class PostDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute); private readonly service = inject(ArticleService);
  readonly article = signal<ArticleDetail | null>(null); readonly error = signal('');
  readonly content = new FormControl('', { nonNullable: true, validators: Validators.required });
  private id = 0;
  ngOnInit(): void { this.id = Number(this.route.snapshot.paramMap.get('id')); this.load(); }
  submit(): void { this.service.comment(this.id, this.content.value).subscribe({ next: () => { this.content.reset(); this.load(); },
    error: event => this.error.set(event.error?.message ?? 'Impossible de publier le commentaire.') }); }
  private load(): void { this.service.detail(this.id).subscribe({ next: value => this.article.set(value),
    error: event => this.error.set(event.error?.message ?? "Impossible de charger l'article.") }); }
}
