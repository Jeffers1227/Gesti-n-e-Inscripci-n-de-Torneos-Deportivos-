import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InscripcionesService } from '../../core/services/inscripciones.service';
import { Inscripcion } from '../../core/models/inscripcion.model';

@Component({
  selector: 'app-inscripciones-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Inscripciones</h1>
          <p>Registra participantes en los eventos disponibles.</p>
        </div>
        <button class="btn" (click)="load()">Actualizar</button>
      </div>

      <section class="card">
        <h2>Crear inscripción</h2>
        <form [formGroup]="createForm" (ngSubmit)="create()" class="form inline">
          <label>ID Participante
            <input type="number" formControlName="participanteId" />
          </label>
          <label>ID Evento
            <input type="number" formControlName="eventoId" />
          </label>
          <label>Equipo
            <input type="text" formControlName="equipo" placeholder="Opcional" />
          </label>
          <button class="btn" type="submit" [disabled]="createForm.invalid">Crear</button>
        </form>
        <p class="hint" *ngIf="createMessage">{{ createMessage }}</p>
      </section>

      <section class="card">
        <h2>Listado de inscripciones</h2>
        <div class="table" *ngIf="inscripciones.length; else empty">
          <div class="table-row header">
            <span>ID</span>
            <span>Participante</span>
            <span>Evento</span>
            <span>Equipo</span>
            <span>Acciones</span>
          </div>
          <div class="table-row" *ngFor="let inscripcion of inscripciones">
            <span>#{{ inscripcion.id }}</span>
            <span>{{ inscripcion.participanteId }}</span>
            <span>{{ inscripcion.eventoId }}</span>
            <span>{{ inscripcion.equipo || 'N/A' }}</span>
            <span class="table-actions">
              <button class="btn-link danger" (click)="remove(inscripcion.id)">Eliminar</button>
            </span>
          </div>
        </div>
        <ng-template #empty>
          <p class="empty">No hay inscripciones registradas.</p>
        </ng-template>
      </section>
    </div>
  `
})
export class InscripcionesPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly inscripcionesService = inject(InscripcionesService);

  inscripciones: Inscripcion[] = [];
  createMessage = '';

  createForm = this.fb.nonNullable.group({
    participanteId: [0, [Validators.required, Validators.min(1)]],
    eventoId: [0, [Validators.required, Validators.min(1)]],
    equipo: ['']
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.inscripcionesService.list().subscribe({
      next: (inscripciones) => (this.inscripciones = inscripciones),
      error: () => (this.inscripciones = [])
    });
  }

  create(): void {
    if (this.createForm.invalid) return;
    const payload = this.createForm.getRawValue() as Inscripcion;
    this.inscripcionesService.create(payload).subscribe({
      next: () => {
        this.createMessage = 'Inscripción creada correctamente.';
        this.createForm.reset();
        this.load();
      },
      error: (err) => (this.createMessage = err?.error?.message || 'No se pudo crear la inscripción.')
    });
  }

  remove(id?: number): void {
    if (!id || !confirm('¿Eliminar esta inscripción?')) return;
    this.inscripcionesService.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo eliminar la inscripción.')
    });
  }
}
