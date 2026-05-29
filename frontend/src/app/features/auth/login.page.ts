import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-shell">
      <div class="auth-card">
        <div class="auth-header">
          <span class="brand-mark">🏆</span>
          <div>
            <h1>Iniciar sesión</h1>
            <p>Accede para administrar los torneos.</p>
          </div>
        </div>

        <form class="form" [formGroup]="form" (ngSubmit)="submit()">
          <label>Email
            <input type="email" formControlName="email" placeholder="usuario@correo.com" />
          </label>
          <label>Contraseña
            <input type="password" formControlName="password" placeholder="••••••••" />
          </label>
          <button class="btn" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Validando...' : 'Ingresar' }}
          </button>
          <p class="hint" *ngIf="message">{{ message }}</p>
        </form>
      </div>
    </div>
  `
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  message = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.message = '';

    const payload = this.form.getRawValue() as { email: string; password: string };
    this.authService.login(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.message = err?.error?.message || 'Credenciales inválidas.';
      }
    });
  }
}
