import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="centered">
      <h1>MDD — Monde de Dév</h1>
      <div class="tabs">
        <button type="button" (click)="registerMode.set(false)">Se connecter</button>
        <button type="button" (click)="registerMode.set(true)">S'inscrire</button>
      </div>
      <form [formGroup]="form" (ngSubmit)="submit()">
        @if (registerMode()) {
          <label>E-mail <input type="email" formControlName="email"></label>
          <label>Nom d'utilisateur <input formControlName="username"></label>
        } @else {
          <label>E-mail ou nom d'utilisateur <input formControlName="identifier"></label>
        }
        <label>Mot de passe <input type="password" formControlName="password"></label>
        @if (registerMode()) {
          <small>8 caractères minimum avec majuscule, minuscule, chiffre et caractère spécial.</small>
        }
        <button type="submit" [disabled]="submitting()">{{ registerMode() ? "S'inscrire" : 'Se connecter' }}</button>
        @if (error()) { <p role="alert" class="error">{{ error() }}</p> }
      </form>
    </main>
  `
})
export class AuthComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly registerMode = signal(false);
  readonly submitting = signal(false);
  readonly error = signal('');
  readonly form = this.fb.group({
    email: ['', Validators.email],
    username: [''],
    identifier: [''],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)]]
  });

  submit(): void {
    const value = this.form.getRawValue();
    const request = this.registerMode()
      ? this.auth.register(value.email ?? '', value.username ?? '', value.password ?? '')
      : this.auth.login(value.identifier ?? '', value.password ?? '');
    this.submitting.set(true);
    this.error.set('');
    request.subscribe({
      next: () => this.router.navigate(['/articles']),
      error: event => {
        this.error.set(event.error?.message ?? 'La demande a échoué.');
        this.submitting.set(false);
      }
    });
  }
}
