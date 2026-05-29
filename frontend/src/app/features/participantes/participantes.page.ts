import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParticipantesService } from '../../core/services/participantes.service';
import { Participante } from '../../core/models/participante.model';

@Component({
  selector: 'app-participantes-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Participantes</h1>
          <p>Registra y administra los participantes del torneo.</p>
        </div>
        <button class="btn" (click)="load()">Actualizar</button>
      </div>

      <div class="grid two-col">
        <section class="card">
          <h2>Crear participante</h2>
          <form [formGroup]="createForm" (ngSubmit)="create()" class="form">
            <label>Nombre
              <input type="text" formControlName="nombre" />
            </label>
            <label>Email
              <input type="email" formControlName="correo" />
            </label>
            <label>Teléfono
              <input type="text" formControlName="telefono" />
            </label>
            <label>Categoría
              <select formControlName="categoria">
                <option value="GENERAL">General</option>
                <option value="JUNIOR">Junior</option>
                <option value="SENIOR">Senior</option>
              </select>
            </label>
            <button class="btn" type="submit" [disabled]="createForm.invalid">Crear</button>
            <p class="hint" *ngIf="createMessage">{{ createMessage }}</p>
          </form>
        </section>

        <section class="card" *ngIf="editMode">
          <h2>Actualizar participante</h2>
          <form [formGroup]="updateForm" (ngSubmit)="update()" class="form">
            <label>Nombre
              <input type="text" formControlName="nombre" />
            </label>
            <label>Email
              <input type="email" formControlName="correo" />
            </label>
            <label>Teléfono
              <input type="text" formControlName="telefono" />
            </label>
            <label>Categoría
              <select formControlName="categoria">
                <option value="GENERAL">General</option>
                <option value="JUNIOR">Junior</option>
                <option value="SENIOR">Senior</option>
              </select>
            </label>
            <div class="actions">
              <button class="btn" type="submit" [disabled]="updateForm.invalid">Guardar cambios</button>
              <button class="btn btn-secondary" type="button" (click)="cancelEdit()">Cancelar</button>
            </div>
            <p class="hint" *ngIf="updateMessage">{{ updateMessage }}</p>
          </form>
        </section>
      </div>

      <section class="card">
        <h2>Listado de participantes</h2>
        <div class="table" *ngIf="participantes.length; else empty">
          <div class="table-row header">
            <span>ID</span>
            <span>Nombre</span>
            <span>Email</span>
            <span>Teléfono</span>
            <span>Categoría</span>
            <span>Acciones</span>
          </div>
          <div class="table-row" *ngFor="let participante of participantes">
            <span>#{{ participante.id }}</span>
            <span>{{ participante.nombre }}</span>
            <span>{{ participante.correo }}</span>
            <span>{{ participante.telefono }}</span>
            <span>{{ participante.categoria }}</span>
            <span class="table-actions">
              <button class="btn-link" (click)="startEdit(participante)">Editar</button>
              <button class="btn-link danger" (click)="remove(participante.id)">Eliminar</button>
            </span>
          </div>
        </div>
        <ng-template #empty>
          <p class="empty">No hay participantes registrados.</p>
        </ng-template>
      </section>
    </div>
  `
})
export class ParticipantesPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly participantesService = inject(ParticipantesService);

  participantes: Participante[] = [];
  editMode = false;
  editId: number | null = null;
  createMessage = '';
  updateMessage = '';

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
      next: (participantes) => (this.participantes = participantes),
      error: () => (this.participantes = [])
    });
  }

  create(): void {
    if (this.createForm.invalid) return;
    const payload = this.createForm.getRawValue() as Participante;
    this.participantesService.create(payload).subscribe({
      next: () => {
        this.createMessage = 'Participante creado correctamente.';
        this.createForm.reset({ categoria: 'GENERAL' });
        this.load();
      },
      error: (err) => (this.createMessage = err?.error?.message || 'No se pudo crear el participante.')
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
        this.updateMessage = 'Participante actualizado.';
        this.cancelEdit();
        this.load();
      },
      error: (err) => (this.updateMessage = err?.error?.message || 'No se pudo actualizar.')
    });
  }

  remove(id?: number): void {
    if (!id || !confirm('¿Eliminar este participante?')) return;
    this.participantesService.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo eliminar el participante.')
    });
  }
}
