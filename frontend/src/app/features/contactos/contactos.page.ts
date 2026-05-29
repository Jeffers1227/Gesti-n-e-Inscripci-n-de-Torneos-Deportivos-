import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactosService } from '../../core/services/contactos.service';
import { ContactoMensaje } from '../../core/models/contacto.model';

@Component({
  selector: 'app-contactos-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Contactos</h1>
          <p>Recibe y administra mensajes de contacto.</p>
        </div>
        <button class="btn" (click)="load()">Actualizar</button>
      </div>

      <section class="card">
        <h2>Nuevo mensaje</h2>
        <form [formGroup]="createForm" (ngSubmit)="create()" class="form">
          <div class="grid two-col">
            <label>Nombre
              <input type="text" formControlName="nombre" />
            </label>
            <label>Email
              <input type="email" formControlName="correo" />
            </label>
          </div>
          <label>Asunto
            <input type="text" formControlName="asunto" />
          </label>
          <label>Mensaje
            <textarea rows="4" formControlName="mensaje"></textarea>
          </label>
          <button class="btn" type="submit" [disabled]="createForm.invalid">Enviar</button>
          <p class="hint" *ngIf="createMessage">{{ createMessage }}</p>
        </form>
      </section>

      <section class="card">
        <h2>Mensajes recibidos</h2>
        <div class="table" *ngIf="mensajes.length; else empty">
          <div class="table-row header">
            <span>ID</span>
            <span>Nombre</span>
            <span>Correo</span>
            <span>Asunto</span>
            <span>Acciones</span>
          </div>
          <div class="table-row" *ngFor="let mensaje of mensajes">
            <span>#{{ mensaje.id }}</span>
            <span>{{ mensaje.nombre }}</span>
            <span>{{ mensaje.correo }}</span>
            <span>{{ mensaje.asunto }}</span>
            <span class="table-actions">
              <button class="btn-link danger" (click)="remove(mensaje.id)">Eliminar</button>
            </span>
          </div>
        </div>
        <ng-template #empty>
          <p class="empty">No hay mensajes registrados.</p>
        </ng-template>
      </section>
    </div>
  `
})
export class ContactosPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly contactosService = inject(ContactosService);

  mensajes: ContactoMensaje[] = [];
  createMessage = '';

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
      next: (mensajes) => (this.mensajes = mensajes),
      error: () => (this.mensajes = [])
    });
  }

  create(): void {
    if (this.createForm.invalid) return;
    const payload = this.createForm.getRawValue() as ContactoMensaje;
    this.contactosService.create(payload).subscribe({
      next: () => {
        this.createMessage = 'Mensaje enviado correctamente.';
        this.createForm.reset({ asunto: 'Consulta' });
        this.load();
      },
      error: (err) => (this.createMessage = err?.error?.message || 'No se pudo enviar el mensaje.')
    });
  }

  remove(id?: number): void {
    if (!id || !confirm('¿Eliminar este mensaje?')) return;
    this.contactosService.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo eliminar el mensaje.')
    });
  }
}
