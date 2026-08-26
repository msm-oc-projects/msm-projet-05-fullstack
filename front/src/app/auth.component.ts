import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

type AuthView = 'home' | 'login' | 'register';

@Component({
  selector: 'app-auth',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="auth-page">
      <img class="auth-logo" src="/assets/logo_p6.png" alt="MDD, Monde de Dév">
      @if (view() === 'home') {
        <h1>Bienvenue sur MDD</h1>
        <p class="auth-intro">Le réseau social des développeurs.</p>
        <div class="auth-actions">
          <button type="button" class="primary-action" (click)="show('register')">S'inscrire</button>
          <button type="button" class="button-secondary" (click)="show('login')">Se connecter</button>
        </div>
      } @else {
        <button type="button" class="back-button" aria-label="Retour à l'accueil" (click)="show('home')">←</button>
        <h1>{{ view() === 'register' ? 'Inscription' : 'Connexion' }}</h1>
        @if (view() === 'register') {
          <form [formGroup]="registerForm" (ngSubmit)="register()">
            <label class="form-field" for="register-email"><span>E-mail</span>
            <input id="register-email" type="email" autocomplete="email" formControlName="email">
            </label>
            <label class="form-field" for="register-username"><span>Nom d'utilisateur</span>
            <input id="register-username" autocomplete="username" formControlName="username">
            </label>
            <label class="form-field" for="register-password"><span>Mot de passe</span>
            <input id="register-password" type="password" autocomplete="new-password" formControlName="password"
              aria-describedby="password-help">
            </label>
            <small id="password-help">8 caractères minimum avec majuscule, minuscule, chiffre et caractère spécial.</small>
            <button type="submit" class="primary-action" [disabled]="registerForm.invalid || submitting()">S'inscrire</button>
          </form>
        } @else {
          <form [formGroup]="loginForm" (ngSubmit)="login()">
            <label class="form-field" for="login-identifier"><span>E-mail ou nom d'utilisateur</span>
            <input id="login-identifier" autocomplete="username" formControlName="identifier">
            </label>
            <label class="form-field" for="login-password"><span>Mot de passe</span>
            <input id="login-password" type="password" autocomplete="current-password" formControlName="password">
            </label>
            <button type="submit" class="primary-action" [disabled]="loginForm.invalid || submitting()">Se connecter</button>
          </form>
        }
        @if (error()) { <p role="alert" class="error-message">{{ error() }}</p> }
      }
    </main>
  `
})
export class AuthComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly view = signal<AuthView>('home');
  readonly submitting = signal(false);
  readonly error = signal('');
  readonly loginForm = this.fb.nonNullable.group({
    identifier: ['', Validators.required],
    password: ['', Validators.required]
  });
  readonly registerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)]]
  });

  show(view: AuthView): void {
    this.view.set(view);
    this.error.set('');
  }

  login(): void {
    if (this.loginForm.invalid) return;
    const value = this.loginForm.getRawValue();
    this.send(this.auth.login(value.identifier, value.password));
  }

  register(): void {
    if (this.registerForm.invalid) return;
    const value = this.registerForm.getRawValue();
    this.send(this.auth.register(value.email, value.username, value.password));
  }

  private send(request: ReturnType<AuthService['login']>): void {
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
