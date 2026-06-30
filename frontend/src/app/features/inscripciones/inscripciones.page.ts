import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InscripcionesService } from '../../core/services/inscripciones.service';
import { Inscripcion } from '../../core/models/inscripcion.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inscripciones-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>🎟️ Gestión de Inscripciones</h1>
          <p>Registra a los equipos en los torneos relámpagos disponibles.</p>
        </div>
        <button class="btn btn-secondary" (click)="load()">Actualizar Lista</button>
      </div>

      <section class="card shadow-form">
        <h2>Inscribir Nuevo Equipo</h2>
        <form [formGroup]="createForm" (ngSubmit)="create()" class="form">
          <div class="grid two-col">
            <label>ID del Participante (Capitán)
              <input type="number" formControlName="participanteId" placeholder="Ej. 1" />
            </label>
            <label>ID del Torneo (Evento)
              <input type="number" formControlName="eventoId" placeholder="Ej. 5" />
            </label>
          </div>
          <label>Nombre del Equipo
            <input type="text" formControlName="equipo" placeholder="Ej. Los Galácticos FC (Opcional)" />
          </label>
          <button class="btn btn-primary" type="submit" [disabled]="createForm.invalid">Generar Inscripción</button>
        </form>
      </section>

      <section class="mt-4">
        <h2>📋 Equipos Inscritos</h2>
        
        <div class="cards-grid" *ngIf="inscripciones.length; else empty">
          <div class="event-card ticket-card" *ngFor="let inscripcion of inscripciones">
            
            <div class="card-header ticket-header">
              <span class="badge">Inscripción #{{ inscripcion.id }}</span>
              <h3>{{ (inscripcion.equipo || 'Equipo sin nombre') | uppercase }}</h3>
            </div>
            
            <div class="card-body">
              <p><strong>👤 ID Capitán:</strong> {{ inscripcion.participanteId }}</p>
              <p><strong>🏆 ID Torneo:</strong> {{ inscripcion.eventoId }}</p>
            </div>
            
            <div class="card-footer">
              <button class="btn danger full-width" (click)="remove(inscripcion.id)">Anular Inscripción</button>
            </div>
            
          </div>
        </div>

        <ng-template #empty>
          <div class="empty-state">
            <h3>No hay equipos inscritos aún.</h3>
            <p>Usa el formulario superior para registrar al primer equipo en un relámpago.</p>
          </div>
        </ng-template>
      </section>
    </div>
  `,
  styles: [`
    .mt-4 { margin-top: 2rem; }
    .shadow-form { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: none; }
    .full-width { width: 100%; display: block; text-align: center; margin-top: 0.5rem; }
    
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }
    
    .event-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease-in-out;
      border: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
    }
    
    .event-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .ticket-header {
      background: #047857; /* Verde deportivo */
      color: white;
      padding: 1.5rem 1.2rem;
      position: relative;
    }
    
    .ticket-header h3 { margin: 0; font-size: 1.25rem; font-weight: 700; line-height: 1.2; }
    
    .card-body { padding: 1.2rem; flex-grow: 1; }
    .card-body p { margin: 0.5rem 0; color: #4b5563; font-size: 0.95rem; }
    
    .card-footer {
      padding: 1rem 1.2rem;
      background: #f8fafc;
      border-top: 2px dashed #cbd5e1; /* Da un efecto de ticket recortable */
    }
    
    .badge {
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 0.75rem;
      font-weight: bold;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: #10b981;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .empty-state {
      text-align: center;
      padding: 3rem;
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      color: #64748b;
    }
  `]
})
export class InscripcionesPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly inscripcionesService = inject(InscripcionesService);
  // LA SOLUCIÓN MÁGICA PARA LA REACTIVIDAD:
  private readonly cdr = inject(ChangeDetectorRef);

  inscripciones: Inscripcion[] = [];

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
      next: (inscripciones) => {
        // Al usar el operador de propagación [...array] forzamos a Angular a ver el cambio
        this.inscripciones = [...inscripciones];
        // Le ordenamos a la pantalla que se repinte instantáneamente
        this.cdr.detectChanges();
      },
      error: () => {
        this.inscripciones = [];
        this.cdr.detectChanges();
      }
    });
  }

  create(): void {
    if (this.createForm.invalid) {
      Swal.fire('Atención', 'Revisa que los IDs del participante y evento sean válidos.', 'warning');
      return;
    }
    
    const payload = this.createForm.getRawValue() as Inscripcion;
    this.inscripcionesService.create(payload).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Inscripción Exitosa!',
          text: 'El equipo ha sido registrado en el torneo.',
          icon: 'success',
          confirmButtonColor: '#047857'
        });
        this.createForm.reset({ participanteId: 0, eventoId: 0, equipo: '' });
        // Recargamos la lista y la pantalla se refrescará al instante
        this.load();
      },
      error: (err) => {
        Swal.fire('Error', err?.error?.message || 'No se pudo generar la inscripción.', 'error');
      }
    });
  }

  remove(id?: number): void {
    if (!id) return;
    
    Swal.fire({
      title: '¿Anular inscripción?',
      text: "El equipo quedará fuera de este torneo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.inscripcionesService.delete(id).subscribe({
          next: () => {
            Swal.fire('Anulada', 'La inscripción fue eliminada correctamente.', 'success');
            // Recargamos la lista y la pantalla se refrescará al instante
            this.load();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar la inscripción.', 'error')
        });
      }
    });
  }
}