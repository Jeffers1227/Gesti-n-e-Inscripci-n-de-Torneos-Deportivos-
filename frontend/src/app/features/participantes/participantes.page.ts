import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParticipantesService } from '../../core/services/participantes.service';
import { Participante } from '../../core/models/participante.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-participantes-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>🏃‍♂️ Jugadores y Participantes</h1>
          <p>Base de datos de los atletas inscritos en el sistema.</p>
        </div>
      </div>

      <div class="grid two-col">
        <section class="card shadow-form">
          <h2>Nuevo Participante</h2>
          <form [formGroup]="createForm" (ngSubmit)="create()" class="form">
            <label>Nombre Completo
              <input type="text" formControlName="nombre" />
            </label>
            <div class="grid two-col">
              <label>Email
                <input type="email" formControlName="correo" />
              </label>
              <label>Teléfono
                <input type="text" formControlName="telefono" />
              </label>
            </div>
            <label>Categoría
              <select formControlName="categoria">
                <option value="GENERAL">General</option>
                <option value="JUNIOR">Junior (Sub-18)</option>
                <option value="SENIOR">Senior (+35)</option>
              </select>
            </label>
            <button class="btn btn-primary" type="submit" [disabled]="createForm.invalid">Registrar Jugador</button>
          </form>
        </section>

        <section class="card shadow-form" *ngIf="editMode">
          <h2>Editar Perfil</h2>
          <form [formGroup]="updateForm" (ngSubmit)="update()" class="form">
            <label>Nombre
              <input type="text" formControlName="nombre" />
            </label>
            <div class="grid two-col">
              <label>Email
                <input type="email" formControlName="correo" />
              </label>
              <label>Teléfono
                <input type="text" formControlName="telefono" />
              </label>
            </div>
            <label>Categoría
              <select formControlName="categoria">
                <option value="GENERAL">General</option>
                <option value="JUNIOR">Junior (Sub-18)</option>
                <option value="SENIOR">Senior (+35)</option>
              </select>
            </label>
            <div class="actions">
              <button class="btn btn-success" type="submit" [disabled]="updateForm.invalid">Guardar</button>
              <button class="btn btn-secondary" type="button" (click)="cancelEdit()">Cancelar</button>
            </div>
          </form>
        </section>
      </div>

      <section class="mt-4">
        <h2>👥 Directorio de Atletas</h2>
        
        <div class="cards-grid" *ngIf="participantes.length; else empty">
          <div class="custom-card" *ngFor="let participante of participantes">
            
            <div class="card-header player-header">
              <span class="badge" 
                    [ngClass]="{
                      'bg-green': participante.categoria === 'JUNIOR', 
                      'bg-purple': participante.categoria === 'SENIOR',
                      'bg-gray': participante.categoria === 'GENERAL' || !participante.categoria
                    }">
                {{ participante.categoria || 'GENERAL' }}
              </span>
              <h3>{{ participante.nombre }}</h3>
            </div>
            
            <div class="card-body">
              <p><strong>📧 Contacto:</strong> {{ participante.correo }}</p>
              <p><strong>📱 Teléfono:</strong> {{ participante.telefono }}</p>
              <p><strong>🔑 ID Sistema:</strong> #{{ participante.id }}</p>
            </div>
            
            <div class="card-footer">
              <button class="btn-link text-blue" (click)="startEdit(participante)">✏️ Modificar</button>
              <button class="btn-link text-red" (click)="remove(participante.id)">🗑️ Dar de Baja</button>
            </div>
            
          </div>
        </div>

        <ng-template #empty>
          <div class="empty-state">
            <h3>No hay jugadores en la base de datos.</h3>
            <p>Empieza a registrar a los atletas para armar los equipos.</p>
          </div>
        </ng-template>
      </section>
    </div>
  `,
  styles: [`
    .mt-4 { margin-top: 2rem; }
    .text-blue { color: #0284c7; }
    .text-red { color: #dc2626; }
    .shadow-form { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: none; }
    
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1rem; }
    
    .custom-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transition: transform 0.2s; border: 1px solid #e5e7eb; display: flex; flex-direction: column; }
    .custom-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
    
    .player-header { background: #4f46e5; color: white; padding: 1.5rem 1.2rem; position: relative; }
    .player-header h3 { margin: 0; font-size: 1.25rem; font-weight: 700; }
    
    .card-body { padding: 1.2rem; flex-grow: 1; }
    .card-body p { margin: 0.5rem 0; color: #4b5563; font-size: 0.95rem; }
    
    .card-footer { padding: 1rem 1.2rem; background: #f8fafc; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; }
    
    .badge { position: absolute; top: -10px; right: -10px; font-size: 0.75rem; font-weight: bold; padding: 0.25rem 0.75rem; border-radius: 9999px; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    
    .bg-green { background-color: #10b981; }
    .bg-purple { background-color: #8b5cf6; }
    .bg-gray { background-color: #64748b; }
    
    .empty-state { text-align: center; padding: 3rem; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; color: #64748b; }
  `]
})
export class ParticipantesPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly participantesService = inject(ParticipantesService);
  private readonly cdr = inject(ChangeDetectorRef);

  participantes: Participante[] = [];
  editMode = false;
  editId: number | null = null;

  createForm = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    categoria: ['GENERAL']
  });

  updateForm = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    categoria: ['GENERAL']
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.participantesService.list().subscribe({
      next: (participantes) => {
        this.participantes = [...participantes];
        this.cdr.detectChanges();
      },
      error: () => {
        this.participantes = [];
        this.cdr.detectChanges();
      }
    });
  }

  create(): void {
    if (this.createForm.invalid) {
      Swal.fire('Atención', 'Verifica que el email sea válido y los campos estén llenos.', 'warning');
      return;
    }
    const payload = this.createForm.getRawValue() as Participante;
    this.participantesService.create(payload).subscribe({
      next: () => {
        Swal.fire('¡Registrado!', 'El jugador fue añadido al directorio.', 'success');
        this.createForm.reset({ categoria: 'GENERAL' });
        this.load();
      },
      error: (err) => Swal.fire('Error', err?.error?.message || 'No se pudo crear.', 'error')
    });
  }

  startEdit(participante: Participante): void {
    this.editMode = true;
    this.editId = participante.id ?? null;
    this.updateForm.patchValue({
      nombre: participante.nombre,
      correo: participante.correo,
      telefono: participante.telefono,
      categoria: participante.categoria ?? 'GENERAL'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editId = null;
    this.updateForm.reset({ categoria: 'GENERAL' });
  }

  update(): void {
    if (this.updateForm.invalid || this.editId == null) return;
    const payload = this.updateForm.getRawValue() as Participante;
    this.participantesService.update(this.editId, payload).subscribe({
      next: () => {
        Swal.fire('¡Actualizado!', 'Perfil del jugador modificado.', 'success');
        this.cancelEdit();
        this.load();
      },
      error: (err) => Swal.fire('Error', err?.error?.message || 'No se pudo actualizar.', 'error')
    });
  }

  remove(id?: number): void {
    if (!id) return;
    Swal.fire({
      title: '¿Dar de baja al jugador?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Dar de baja',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.participantesService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Jugador borrado de la base de datos.', 'success');
            this.load();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar al jugador.', 'error')
        });
      }
    });
  }
}