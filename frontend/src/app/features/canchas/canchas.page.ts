import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CanchasService } from '../../core/services/canchas.service';
import { Cancha } from '../../core/models/cancha.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-canchas-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>🏟️ Gestión de Canchas</h1>
          <p>Administra las instalaciones, superficies y precios de alquiler.</p>
        </div>
      </div>

      <div class="grid two-col">
        <section class="card shadow-form">
          <h2>Registrar Nueva Cancha</h2>
          <form [formGroup]="createForm" (ngSubmit)="create()" class="form">
            <label>Nombre de la Cancha
              <input type="text" formControlName="nombre" placeholder="Ej. Cancha Principal" />
            </label>
            <label>Ubicación exacta
              <input type="text" formControlName="ubicacion" placeholder="Ej. Sede Norte" />
            </label>
            <div class="grid two-col">
              <label>Tipo de superficie
                <input type="text" formControlName="tipo" placeholder="Ej. Sintética, Césped..." />
              </label>
              <label>Precio por hora (S/.)
                <input type="number" min="0" formControlName="precioPorHora" />
              </label>
            </div>
            <button class="btn btn-primary" type="submit" [disabled]="createForm.invalid">Guardar Cancha</button>
          </form>
        </section>

        <section class="card shadow-form" *ngIf="editMode">
          <h2>Actualizar Datos</h2>
          <form [formGroup]="updateForm" (ngSubmit)="update()" class="form">
            <label>Nombre
              <input type="text" formControlName="nombre" />
            </label>
            <label>Ubicación
              <input type="text" formControlName="ubicacion" />
            </label>
            <div class="grid two-col">
              <label>Tipo de superficie
                <input type="text" formControlName="tipo" />
              </label>
              <label>Precio por hora (S/.)
                <input type="number" min="0" formControlName="precioPorHora" />
              </label>
            </div>
            <div class="actions">
              <button class="btn btn-success" type="submit" [disabled]="updateForm.invalid">Actualizar</button>
              <button class="btn btn-secondary" type="button" (click)="cancelEdit()">Cancelar</button>
            </div>
          </form>
        </section>
      </div>

      <section class="mt-4">
        <h2>📍 Instalaciones Disponibles</h2>
        
        <div class="cards-grid" *ngIf="canchas.length; else empty">
          <div class="custom-card" *ngFor="let cancha of canchas">
            
            <div class="card-header cancha-header">
              <span class="badge type-badge">{{ cancha.tipo | uppercase }}</span>
              <h3>{{ cancha.nombre }}</h3>
            </div>
            
            <div class="card-body">
              <p><strong>📍 Ubicación:</strong> {{ cancha.ubicacion }}</p>
              <p><strong>💰 Precio de alquiler:</strong> {{ cancha.precioPorHora | currency:'PEN':'S/. ' }} por hora</p>
            </div>
            
            <div class="card-footer">
              <button class="btn-link text-blue" (click)="startEdit(cancha)">✏️ Editar</button>
              <button class="btn-link text-red" (click)="remove(cancha.id)">🗑️ Eliminar</button>
            </div>
            
          </div>
        </div>

        <ng-template #empty>
          <div class="empty-state">
            <h3>No hay canchas registradas.</h3>
            <p>Agrega la primera instalación deportiva en el formulario.</p>
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
    
    .cancha-header { background: #0284c7; color: white; padding: 1.5rem 1.2rem; position: relative; }
    .cancha-header h3 { margin: 0; font-size: 1.25rem; font-weight: 700; }
    
    .card-body { padding: 1.2rem; flex-grow: 1; }
    .card-body p { margin: 0.5rem 0; color: #4b5563; font-size: 0.95rem; }
    
    .card-footer { padding: 1rem 1.2rem; background: #f8fafc; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; }
    
    .type-badge { position: absolute; top: -10px; right: -10px; font-size: 0.75rem; font-weight: bold; padding: 0.25rem 0.75rem; border-radius: 9999px; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    
    .empty-state { text-align: center; padding: 3rem; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; color: #64748b; }
  `]
})
export class CanchasPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly canchasService = inject(CanchasService);
  private readonly cdr = inject(ChangeDetectorRef);

  canchas: Cancha[] = [];
  editMode = false;
  editId: number | null = null;

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
      next: (canchas) => {
        this.canchas = [...canchas];
        this.cdr.detectChanges();
      },
      error: () => {
        this.canchas = [];
        this.cdr.detectChanges();
      }
    });
  }

  create(): void {
    if (this.createForm.invalid) {
      Swal.fire('Atención', 'Revisa los campos obligatorios.', 'warning');
      return;
    }
    const payload = this.createForm.getRawValue() as Cancha;
    this.canchasService.create(payload).subscribe({
      next: () => {
        Swal.fire('¡Cancha Registrada!', 'Se agregó exitosamente a la base de datos.', 'success');
        this.createForm.reset({ tipo: 'STANDARD', precioPorHora: 0 });
        this.load();
      },
      error: (err) => Swal.fire('Error', err?.error?.message || 'No se pudo crear la cancha.', 'error')
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        Swal.fire('¡Actualizada!', 'Los cambios fueron guardados.', 'success');
        this.cancelEdit();
        this.load();
      },
      error: (err) => Swal.fire('Error', err?.error?.message || 'No se pudo actualizar.', 'error')
    });
  }

  remove(id?: number): void {
    if (!id) return;
    Swal.fire({
      title: '¿Eliminar Cancha?',
      text: "Se borrará permanentemente del sistema.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.canchasService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'La cancha fue borrada con éxito.', 'success');
            this.load();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar la cancha.', 'error')
        });
      }
    });
  }
}