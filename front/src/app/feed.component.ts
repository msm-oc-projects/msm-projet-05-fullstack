import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ArticleService, ArticleSummary } from './article.service';

@Component({
  selector: 'app-feed', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="page feed-page"><header class="feed-toolbar">
      <button type="button" class="primary-action" (click)="router.navigate(['/articles/new'])">Créer un article</button>
      <button type="button" class="sort-control" (click)="toggleSort()" [attr.aria-label]="sort() === 'desc' ? 'Trier du plus ancien au plus récent' : 'Trier du plus récent au plus ancien'">
        <span>Trier par</span><span class="sort-arrow" [class.sort-arrow--ascending]="sort() === 'asc'" aria-hidden="true"></span>
      </button>
    </header>
      @if (error()) { <p role="alert" class="error">{{ error() }}</p> }
      @if (!loading() && articles().length === 0) { <p class="empty-state">Abonnez-vous à un thème pour alimenter votre fil.</p> }
      <section class="article-grid" aria-label="Fil d'actualité">@for (article of articles(); track article.id) {
        <a class="article-card" [routerLink]="['/articles', article.id]">
          <h2>{{ article.title }}</h2>
          <p class="article-meta"><span>{{ article.createdAt | date:'dd/MM/yyyy' }}</span><span>{{ article.author }}</span></p>
          <p class="article-excerpt">{{ article.content }}</p>
        </a>
      }</section>
    </main>`
})
export class FeedComponent implements OnInit {
  private readonly service = inject(ArticleService);
  readonly router = inject(Router);
  readonly articles = signal<ArticleSummary[]>([]);
  readonly sort = signal<'asc' | 'desc'>('desc');
  readonly loading = signal(true);
  readonly error = signal('');
  ngOnInit(): void { this.load(); }
  toggleSort(): void { this.sort.update(value => value === 'desc' ? 'asc' : 'desc'); this.load(); }
  private load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.feed(this.sort()).subscribe({
      next: articles => { this.articles.set(articles); this.loading.set(false); },
      error: event => { this.error.set(event.error?.message ?? 'Impossible de charger le fil.'); this.loading.set(false); }
    });
  }
}
