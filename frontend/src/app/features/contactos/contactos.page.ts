import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactosService } from '../../core/services/contactos.service';
import { ContactoMensaje } from '../../core/models/contacto.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contactos-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>📬 Bandeja de Contacto</h1>
          <p>Buzón de consultas, reportes y atención a usuarios.</p>
        </div>
      </div>

      <section class="card shadow-form">
        <h2>Redactar Mensaje</h2>
        <form [formGroup]="createForm" (ngSubmit)="create()" class="form">
          <div class="grid two-col">
            <label>Remitente (Nombre)
              <input type="text" formControlName="nombre" />
            </label>
            <label>Correo Electrónico
              <input type="email" formControlName="correo" />
            </label>
          </div>
          <label>Asunto
            <input type="text" formControlName="asunto" />
          </label>
          <label>Mensaje
            <textarea rows="4" formControlName="mensaje" placeholder="Escribe tu consulta aquí..."></textarea>
          </label>
          <button class="btn btn-primary" type="submit" [disabled]="createForm.invalid">📩 Enviar Mensaje</button>
        </form>
      </section>

      <section class="mt-4">
        <h2>📥 Mensajes Recibidos</h2>
        
        <div class="cards-grid" *ngIf="mensajes.length; else empty">
          <div class="custom-card" *ngFor="let mensaje of mensajes">
            
            <div class="card-header msg-header">
              <span class="badge msg-badge">Buzón #{{ mensaje.id }}</span>
              <h3>{{ mensaje.asunto }}</h3>
            </div>
            
            <div class="card-body">
              <p><strong>De:</strong> {{ mensaje.nombre }}</p>
              <p><strong>Email:</strong> <a href="mailto:{{ mensaje.correo }}" class="text-orange">{{ mensaje.correo }}</a></p>
              <hr class="divider">
              <p class="msg-content">"{{ mensaje.mensaje }}"</p>
            </div>
            
            <div class="card-footer">
              <button class="btn danger full-width" (click)="remove(mensaje.id)">🗑️ Eliminar Mensaje</button>
            </div>
            
          </div>
        </div>

        <ng-template #empty>
          <div class="empty-state">
            <h3>Bandeja vacía.</h3>
            <p>No tienes mensajes pendientes de lectura en este momento.</p>
          </div>
        </ng-template>
      </section>
    </div>
  `,
  styles: [`
    .mt-4 { margin-top: 2rem; }
    .text-orange { color: #ea580c; text-decoration: none; font-weight: bold; }
    .shadow-form { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: none; }
    .full-width { width: 100%; display: block; text-align: center; }
    
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 1rem; }
    
    .custom-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transition: transform 0.2s; border: 1px solid #e5e7eb; display: flex; flex-direction: column; }
    .custom-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
    
    .msg-header { background: #ea580c; color: white; padding: 1.5rem 1.2rem; position: relative; }
    .msg-header h3 { margin: 0; font-size: 1.15rem; font-weight: 700; }
    
    .card-body { padding: 1.2rem; flex-grow: 1; }
    .card-body p { margin: 0.5rem 0; color: #4b5563; font-size: 0.95rem; }
    
    .divider { border: 0; border-top: 1px solid #e5e7eb; margin: 1rem 0; }
    .msg-content { font-style: italic; color: #374151 !important; }
    
    .card-footer { padding: 1rem 1.2rem; background: #fff7ed; border-top: 1px solid #fed7aa; }
    
    .badge { position: absolute; top: -10px; right: -10px; font-size: 0.75rem; font-weight: bold; padding: 0.25rem 0.75rem; border-radius: 9999px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .msg-badge { background: #ffedd5; color: #9a3412; border: 1px solid #fdba74; }
    
    .empty-state { text-align: center; padding: 3rem; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; color: #64748b; }
  `]
})
export class ContactosPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly contactosService = inject(ContactosService);
  private readonly cdr = inject(ChangeDetectorRef);

  mensajes: ContactoMensaje[] = [];

  createForm = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    asunto: ['Consulta'],
    mensaje: ['', Validators.required]
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.contactosService.listMensajes().subscribe({
      next: (mensajes) => {
        this.mensajes = [...mensajes];
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensajes = [];
        this.cdr.detectChanges();
      }
    });
  }

  create(): void {
    if (this.createForm.invalid) {
      Swal.fire('Atención', 'Revisa el formulario. Todos los campos son necesarios.', 'warning');
      return;
    }
    const payload = this.createForm.getRawValue() as ContactoMensaje;
    this.contactosService.create(payload).subscribe({
      next: () => {
        Swal.fire('¡Enviado!', 'Tu mensaje ha sido recibido exitosamente.', 'success');
        this.createForm.reset({ asunto: 'Consulta' });
        this.load();
      },
      error: (err) => Swal.fire('Error', err?.error?.message || 'No se pudo enviar.', 'error')
    });
  }

  remove(id?: number): void {
    if (!id) return;
    Swal.fire({
      title: '¿Borrar mensaje?',
      text: "No podrás recuperar este mensaje de la bandeja.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactosService.delete(id).subscribe({
          next: () => {
            Swal.fire('Borrado', 'El mensaje fue eliminado.', 'success');
            this.load();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el mensaje.', 'error')
        });
      }
    });
  }
}