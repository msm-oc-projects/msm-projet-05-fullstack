import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Profile, ProfileService } from './profile.service';
import { TopicService } from './topic/topic.service';

@Component({ selector: 'app-profile', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main><h1>Profil utilisateur</h1><form [formGroup]="form" (ngSubmit)="save()">
    <label>Nom d'utilisateur <input formControlName="username"></label><label>E-mail <input type="email" formControlName="email"></label>
    <label>Nouveau mot de passe <input type="password" formControlName="password"></label><button type="submit">Sauvegarder</button></form>
    @if (message()) { <p aria-live="polite">{{ message() }}</p> } @if (error()) { <p role="alert" class="error">{{ error() }}</p> }
    <h2>Abonnements</h2><section class="grid">@for (topic of profile()?.subscriptions ?? []; track topic.id) {
      <article class="card"><h3>{{ topic.name }}</h3><p>{{ topic.description }}</p><button (click)="unsubscribe(topic.id)">Se désabonner</button></article>
    } @empty { <p>Aucun abonnement.</p> }</section></main>` })
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder); private readonly service = inject(ProfileService); private readonly topics = inject(TopicService);
  readonly profile = signal<Profile | null>(null); readonly message = signal(''); readonly error = signal('');
  readonly form = this.fb.group({ email: ['', [Validators.required, Validators.email]], username: ['', Validators.required], password: [''] });
  ngOnInit(): void { this.load(); }
  save(): void { const v = this.form.getRawValue(); this.service.update(v.email!, v.username!, v.password || undefined).subscribe({
    next: profile => { this.set(profile); this.message.set('Profil mis à jour.'); }, error: e => this.error.set(e.error?.message ?? 'Mise à jour impossible.') }); }
  unsubscribe(id: number): void { this.topics.unsubscribe(id).subscribe({ next: () => this.load(), error: e => this.error.set(e.error?.message ?? 'Désabonnement impossible.') }); }
  private load(): void { this.service.get().subscribe({ next: profile => this.set(profile), error: e => this.error.set(e.error?.message ?? 'Profil indisponible.') }); }
  private set(profile: Profile): void { this.profile.set(profile); this.form.patchValue({ email: profile.email, username: profile.username, password: '' }); }
}
