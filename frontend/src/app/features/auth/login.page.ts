import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="glass-card">
        <div class="auth-header">
          <div class="brand-icon">🏆</div>
          <h1>Bienvenido</h1>
          <p>Gestión de Torneos Deportivos</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
        <div class="input-group">
          <label>Correo Electrónico</label>
          <input type="email" formControlName="email" placeholder="admin@sistema.com" />
          <div class="error-msg" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
            <small *ngIf="form.get('email')?.errors?.['required']">⚠️ El correo es obligatorio.</small>
            <small *ngIf="form.get('email')?.errors?.['email']">⚠️ Ingresa un formato válido.</small>
          </div>
        </div>
        
        <div class="input-group">
          <label>Contraseña</label>
          <input type="password" formControlName="password" placeholder="••••••••" />
          <div class="error-msg" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
            <small>⚠️ La contraseña es requerida.</small>
          </div>
        </div>

        <button type="submit" [disabled]="form.invalid || loading" class="btn-login">
          <span *ngIf="!loading">Acceder al Sistema</span>
          <div class="spinner" *ngIf="loading"></div>
        </button>
      </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      position: relative;
      overflow: hidden;
    }

    .error-msg { color: #fca5a5; font-size: 0.8rem; margin-top: 5px; animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

    /* Fondo animado sutil */
    .auth-page::before {
      content: '';
      position: absolute;
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%);
      top: -100px; left: -100px;
      animation: float 10s infinite alternate;
    }

    @keyframes float { 0% { transform: translate(0,0); } 100% { transform: translate(50px, 50px); } }

    .glass-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 3rem;
      border-radius: 24px;
      width: 100%;
      max-width: 400px;
      text-align: center;
      color: white;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }

    .brand-icon { font-size: 3rem; margin-bottom: 1rem; }
    h1 { font-size: 1.8rem; margin: 0; }
    p { color: #94a3b8; margin-bottom: 2rem; }

    .input-group { text-align: left; margin-bottom: 1.5rem; }
    label { display: block; font-size: 0.85rem; margin-bottom: 0.5rem; color: #cbd5e1; }
    input {
      width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #334155;
      background: rgba(0,0,0,0.2); color: white; transition: 0.3s;
    }
    input:focus { outline: none; border-color: #10b981; box-shadow: 0 0 0 4px rgba(16,185,129,0.1); }

    .btn-login {
      width: 100%; padding: 14px; border-radius: 12px; border: none;
      background: #10b981; color: white; font-weight: bold; cursor: pointer;
      transition: 0.3s; display: flex; justify-content: center;
    }
    .btn-login:hover:not(:disabled) { background: #059669; transform: scale(1.02); }

    .spinner {
      width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%; border-top-color: white; animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    this.authService.login(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({ icon: 'success', title: '¡Bienvenido!', text: 'Acceso autorizado', timer: 1500, showConfirmButton: false });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({ icon: 'error', title: 'Oops...', text: err?.error?.message || 'Credenciales incorrectas' });
      }
    });
  }
}