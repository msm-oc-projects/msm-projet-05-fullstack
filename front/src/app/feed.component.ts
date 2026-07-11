import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ArticleService, ArticleSummary } from './article.service';

@Component({
  selector: 'app-feed', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main><header class="actions"><button (click)="router.navigate(['/articles/new'])">Créer un article</button>
      <button (click)="toggleSort()">Trier : {{ sort() === 'desc' ? 'plus récent' : 'plus ancien' }}</button></header>
      @if (error()) { <p role="alert" class="error">{{ error() }}</p> }
      @if (!loading() && articles().length === 0) { <p>Abonnez-vous à un thème pour alimenter votre fil.</p> }
      <section class="grid">@for (article of articles(); track article.id) {
        <article class="card" tabindex="0" (click)="open(article.id)" (keydown.enter)="open(article.id)">
          <h2>{{ article.title }}</h2><p>{{ article.createdAt | date:'dd/MM/yyyy' }} · {{ article.author }}</p>
          <p>{{ article.topic }}</p><p>{{ article.content }}</p>
        </article>
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
  open(id: number): void { this.router.navigate(['/articles', id]); }
  private load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.feed(this.sort()).subscribe({
      next: articles => { this.articles.set(articles); this.loading.set(false); },
      error: event => { this.error.set(event.error?.message ?? 'Impossible de charger le fil.'); this.loading.set(false); }
    });
  }
}
