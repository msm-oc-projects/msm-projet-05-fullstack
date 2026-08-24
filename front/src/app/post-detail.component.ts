import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ArticleDetail, ArticleService } from './article.service';

@Component({ selector: 'app-post-detail', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main class="page article-detail-page">
    <button type="button" class="back-link" (click)="router.navigate(['/articles'])"><span aria-hidden="true">←</span> Retour</button>
    @if (article(); as item) {
      <article class="article-detail"><h1>{{ item.title }}</h1>
        <p class="article-meta article-meta--detail"><span>{{ item.createdAt | date:'dd/MM/yyyy' }}</span><span>{{ item.author }}</span><span>{{ item.topic }}</span></p>
        <p class="article-body">{{ item.content }}</p>
      </article>
      <section class="comments-section"><h2>Commentaires</h2>
        <div class="comment-list">@for (comment of item.comments; track comment.id) {
          <article class="comment-row"><p class="comment-author">{{ comment.author }}</p><div class="comment-bubble"><p>{{ comment.content }}</p></div></article>
        } @empty { <p class="empty-state">Aucun commentaire.</p> }</div>
        <form class="comment-form" (submit)="$event.preventDefault(); submit()"><label class="sr-only" for="comment-content">Ajouter un commentaire</label>
          <textarea id="comment-content" [formControl]="content" rows="4" placeholder="Écrivez ici votre commentaire"></textarea>
          <button type="submit" class="primary-action" [disabled]="content.invalid">Envoyer</button></form>
      </section>
    } @if (error()) { <p role="alert" class="error">{{ error() }}</p> }</main>` })
export class PostDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute); private readonly service = inject(ArticleService);
  readonly router = inject(Router);
  readonly article = signal<ArticleDetail | null>(null); readonly error = signal('');
  readonly content = new FormControl('', { nonNullable: true, validators: Validators.required });
  private id = 0;
  ngOnInit(): void { this.id = Number(this.route.snapshot.paramMap.get('id')); this.load(); }
  submit(): void { this.service.comment(this.id, this.content.value).subscribe({ next: () => { this.content.reset(); this.load(); },
    error: event => this.error.set(event.error?.message ?? 'Impossible de publier le commentaire.') }); }
  private load(): void { this.service.detail(this.id).subscribe({ next: value => this.article.set(value),
    error: event => this.error.set(event.error?.message ?? "Impossible de charger l'article.") }); }
}
