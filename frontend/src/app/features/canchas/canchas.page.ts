import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CanchasService } from '../../core/services/canchas.service';
import { Cancha } from '../../core/models/cancha.model';

@Component({
  selector: 'app-canchas-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Canchas</h1>
          <p>Administra canchas, ubicación y precios.</p>
        </div>
        <button class="btn" (click)="load()">Actualizar</button>
      </div>

      <div class="grid two-col">
        <section class="card">
          <h2>Crear cancha</h2>
          <form [formGroup]="createForm" (ngSubmit)="create()" class="form">
            <label>Nombre
              <input type="text" formControlName="nombre" />
            </label>
            <label>Ubicación
              <input type="text" formControlName="ubicacion" />
            </label>
            <label>Tipo de superficie
              <input type="text" formControlName="tipo" placeholder="STANDARD" />
            </label>
            <label>Precio por hora
              <input type="number" min="0" formControlName="precioPorHora" />
            </label>
            <button class="btn" type="submit" [disabled]="createForm.invalid">Crear</button>
            <p class="hint" *ngIf="createMessage">{{ createMessage }}</p>
          </form>
        </section>

        <section class="card" *ngIf="editMode">
          <h2>Actualizar cancha</h2>
          <form [formGroup]="updateForm" (ngSubmit)="update()" class="form">
            <label>Nombre
              <input type="text" formControlName="nombre" />
            </label>
            <label>Ubicación
              <input type="text" formControlName="ubicacion" />
            </label>
            <label>Tipo de superficie
              <input type="text" formControlName="tipo" />
            </label>
            <label>Precio por hora
              <input type="number" min="0" formControlName="precioPorHora" />
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
        <h2>Listado de canchas</h2>
        <div class="table" *ngIf="canchas.length; else empty">
          <div class="table-row header">
            <span>ID</span>
            <span>Nombre</span>
            <span>Ubicación</span>
            <span>Tipo</span>
            <span>Precio/Hora</span>
            <span>Acciones</span>
          </div>
          <div class="table-row" *ngFor="let cancha of canchas">
            <span>#{{ cancha.id }}</span>
            <span>{{ cancha.nombre }}</span>
            <span>{{ cancha.ubicacion }}</span>
            <span>{{ cancha.tipo }}</span>
            <span>{{ cancha.precioPorHora ?? 0 | number:'1.0-2' }}</span>
            <span class="table-actions">
              <button class="btn-link" (click)="startEdit(cancha)">Editar</button>
              <button class="btn-link danger" (click)="remove(cancha.id)">Eliminar</button>
            </span>
          </div>
        </div>
        <ng-template #empty>
          <p class="empty">No hay canchas registradas.</p>
        </ng-template>
      </section>
    </div>
  `
})
export class CanchasPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly canchasService = inject(CanchasService);

  canchas: Cancha[] = [];
  editMode = false;
  editId: number | null = null;
  createMessage = '';
  updateMessage = '';

  createForm = this.fb.group({
    nombre: ['', Validators.required],
    ubicacion: ['', Validators.required],
    tipo: ['STANDARD'],
    precioPorHora: [0]
  });

  updateForm = this.fb.group({
    nombre: ['', Validators.required],
    ubicacion: ['', Validators.required],
    tipo: ['STANDARD'],
    precioPorHora: [0]
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.canchasService.list().subscribe({
      next: (canchas) => (this.canchas = canchas),
      error: () => (this.canchas = [])
    });
  }

  create(): void {
    if (this.createForm.invalid) return;
    const payload = this.createForm.getRawValue() as Cancha;
    this.canchasService.create(payload).subscribe({
      next: () => {
        this.createMessage = 'Cancha creada correctamente.';
        this.createForm.reset({ tipo: 'STANDARD', precioPorHora: 0 });
        this.load();
      },
      error: (err) => (this.createMessage = err?.error?.message || 'No se pudo crear la cancha.')
    });
  }

  startEdit(cancha: Cancha): void {
    this.editMode = true;
    this.editId = cancha.id ?? null;
    this.updateForm.patchValue({
      nombre: cancha.nombre,
      ubicacion: cancha.ubicacion,
      tipo: cancha.tipo ?? 'STANDARD',
      precioPorHora: cancha.precioPorHora ?? 0
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editId = null;
    this.updateForm.reset({ tipo: 'STANDARD', precioPorHora: 0 });
  }

  update(): void {
    if (this.updateForm.invalid || this.editId == null) return;
    const payload = this.updateForm.getRawValue() as Cancha;
    this.canchasService.update(this.editId, payload).subscribe({
      next: () => {
        this.updateMessage = 'Cancha actualizada.';
        this.cancelEdit();
        this.load();
      },
      error: (err) => (this.updateMessage = err?.error?.message || 'No se pudo actualizar.')
    });
  }

  remove(id?: number): void {
    if (!id || !confirm('¿Eliminar esta cancha?')) return;
    this.canchasService.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo eliminar la cancha.')
    });
  }
}
