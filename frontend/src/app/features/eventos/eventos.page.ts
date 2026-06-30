import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventosService } from '../../core/services/eventos.service';
import { Evento } from '../../core/models/evento.model';
import { EventoFilaComponent } from './evento-fila.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eventos-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EventoFilaComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>🏆 Torneos Relámpagos</h1>
          <p>Gestiona la cartelera de eventos deportivos.</p>
        </div>
        <button class="btn" (click)="load()">Actualizar Cartelera</button>
      </div>

      <div class="grid two-col">
        <section class="card shadow-form">
          <h2>Crear Nuevo Torneo</h2>
          <form [formGroup]="createForm" (ngSubmit)="create()" class="form">
            <div class="grid two-col">
              <label>Fecha <input type="date" formControlName="fecha" /></label>
              <label>Hora <input type="time" formControlName="hora" /></label>
            </div>
            <label>Ubicación (Cancha) <input type="text" formControlName="lugar" placeholder="Ej. Cancha Sintética Central" /></label>
            <label>Nombre del Torneo <input type="text" formControlName="descripcion" placeholder="Ej. Copa Relámpago Verano" /></label>
            <label>Equipos Máximos <input type="number" min="1" formControlName="capacidadMaxima" /></label>
            <button class="btn btn-primary" type="submit" [disabled]="createForm.invalid">Guardar Torneo</button>
          </form>
        </section>

        <section class="card shadow-form" *ngIf="editMode">
          <h2>Actualizar Torneo</h2>
          <form [formGroup]="updateForm" (ngSubmit)="update()" class="form">
            <div class="grid two-col">
              <label>Fecha <input type="date" formControlName="fecha" /></label>
              <label>Hora <input type="time" formControlName="hora" /></label>
            </div>
            <label>Ubicación <input type="text" formControlName="lugar" /></label>
            <label>Nombre del Torneo <input type="text" formControlName="descripcion" /></label>
            <label>Equipos Máximos <input type="number" min="1" formControlName="capacidadMaxima" /></label>
            <div class="actions">
              <button class="btn btn-success" type="submit" [disabled]="updateForm.invalid">Guardar Cambios</button>
              <button class="btn btn-secondary" type="button" (click)="cancelEdit()">Cancelar</button>
            </div>
          </form>
        </section>
      </div>

      <section class="mt-4">
        <h2>🔥 Cartelera de Torneos</h2>
        
        <div class="cards-grid" *ngIf="eventos.length; else emptyEventos">
          <div class="event-card" *ngFor="let evento of eventos" [ngClass]="{'vip-card': evento.id === 1}">
            
            <div class="card-header">
              <span class="badge vip-badge" *ngIf="evento.id === 1">🌟 Torneo Estelar</span>
              <h3>{{ (evento.descripcion || 'Torneo Relámpago') | uppercase }}</h3>
            </div>
            
            <div class="card-body">
              <p><strong>📅 Fecha:</strong> {{ evento.fecha | date:'dd/MM/yyyy' }}</p>
              <p><strong>⏰ Hora:</strong> {{ evento.hora }}</p>
              <p><strong>📍 Cancha:</strong> {{ evento.lugar }}</p>
              <p><strong>👥 Capacidad:</strong> {{ evento.capacidadMaxima }} equipos</p>
            </div>
            
            <div class="card-footer flex-between">
              <button class="btn-link text-blue" (click)="startEdit(evento)">✏️ Editar</button>
              <button class="btn-link text-red" (click)="remove(evento.id)">🗑️ Cancelar Torneo</button>
            </div>
            
          </div>
        </div>

        <ng-template #emptyEventos>
          <div class="empty-state">
             <h3>No hay torneos programados.</h3>
             <p>Anímate a crear el primer relámpago en el formulario de arriba.</p>
          </div>
        </ng-template>
      </section>

      <section class="card mt-4 shadow-form">
        <h2>Buscador de Torneos</h2>
        <form [formGroup]="searchForm" (ngSubmit)="search()" class="form inline">
          <label>Buscar por Fecha Exacta
            <input type="date" formControlName="fecha" />
          </label>
          <button class="btn" type="submit" [disabled]="searchForm.invalid">🔍 Buscar</button>
        </form>
        
        <div class="cards-grid mt-4" *ngIf="searchResults.length; else emptySearch">
          <div *ngFor="let evento of searchResults">
            <app-evento-fila 
              [eventoData]="evento" 
              (eventoSeleccionado)="eliminarDesdeHijo($event)">
            </app-evento-fila>
          </div>
        </div>

        <ng-template #emptySearch>
          <p class="empty text-center mt-2">Usa el buscador para filtrar la cartelera.</p>
        </ng-template>
      </section>
    </div>
  `,
  styles: [`
    .mt-4 { margin-top: 2rem; }
    .text-center { text-align: center; }
    .text-blue { color: #0284c7; }
    .text-red { color: #dc2626; }
    .shadow-form { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: none; }
    
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
    
    .card-header {
      background: #1e293b;
      color: white;
      padding: 1.5rem 1.2rem;
      position: relative;
    }
    
    .card-header h3 { margin: 0; font-size: 1.25rem; font-weight: 700; line-height: 1.2; }
    
    .card-body {
      padding: 1.2rem;
      flex-grow: 1;
    }
    
    .card-body p { margin: 0.5rem 0; color: #4b5563; font-size: 0.95rem; }
    
    .card-footer {
      padding: 1rem 1.2rem;
      background: #f8fafc;
      border-top: 1px solid #e5e7eb;
    }
    
    .flex-between { display: flex; justify-content: space-between; align-items: center; }
    
    .vip-card { border: 2px solid #fbbf24; }
    .vip-card .card-header { background: linear-gradient(135deg, #b45309 0%, #d97706 100%); }
    
    .badge {
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 0.75rem;
      font-weight: bold;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
    }
    .vip-badge { background: #fef08a; color: #854d0e; border: 1px solid #facc15; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    
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
export class EventosPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly eventosService = inject(EventosService);
  // 1. INYECTAMOS EL DETECTOR DE CAMBIOS AQUÍ
  private readonly cdr = inject(ChangeDetectorRef);

  eventos: Evento[] = [];
  searchResults: Evento[] = [];
  editMode = false;
  editId: number | null = null;

  createForm = this.fb.group({
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    lugar: ['', Validators.required],
    descripcion: [''],
    capacidadMaxima: [20]
  });

  updateForm = this.fb.group({
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    lugar: ['', Validators.required],
    descripcion: [''],
    capacidadMaxima: [20]
  });

  searchForm = this.fb.group({
    fecha: ['', Validators.required]
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.eventosService.list().subscribe({
      next: (eventos) => {
        // 2. FORZAMOS A ANGULAR A LEER LA LISTA COMO NUEVA
        this.eventos = [...eventos];
        // 3. ORDENAMOS EL REFRESCO INMEDIATO
        this.cdr.detectChanges();
      },
      error: () => {
        this.eventos = [];
        this.cdr.detectChanges();
      }
    });
  }

  create(): void {
    if (this.createForm.invalid) {
      Swal.fire('Error', 'Por favor completa los campos requeridos', 'warning');
      return;
    }
    const payload = this.createForm.getRawValue() as Evento;
    this.eventosService.create(payload).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Torneo Creado!',
          text: 'El evento se ha publicado en la cartelera.',
          icon: 'success',
          confirmButtonColor: '#10b981'
        });
        this.createForm.reset({ capacidadMaxima: 20 });
        this.load();
      },
      error: (err) => {
        Swal.fire('Error', err?.error?.message || 'No se pudo crear el evento', 'error');
      }
    });
  }

  startEdit(evento: Evento): void {
    this.editMode = true;
    this.editId = evento.id ?? null;
    this.updateForm.patchValue({
      fecha: evento.fecha,
      hora: evento.hora,
      lugar: evento.lugar,
      descripcion: evento.descripcion ?? '',
      capacidadMaxima: evento.capacidadMaxima ?? 20
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editId = null;
    this.updateForm.reset({ capacidadMaxima: 20 });
  }

  update(): void {
    if (this.updateForm.invalid || this.editId == null) return;
    const payload = this.updateForm.getRawValue() as Evento;
    this.eventosService.update(this.editId, payload).subscribe({
      next: () => {
        Swal.fire('¡Actualizado!', 'Los datos del torneo han sido guardados.', 'success');
        this.cancelEdit();
        this.load();
      },
      error: (err) => Swal.fire('Error', err?.error?.message || 'No se pudo actualizar', 'error')
    });
  }

  remove(id?: number): void {
    if (!id) return;
    
    Swal.fire({
      title: '¿Cancelar Torneo?',
      text: "Esta acción no se puede deshacer y borrará a los inscritos.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cancelar torneo',
      cancelButtonText: 'Regresar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventosService.delete(id).subscribe({
          next: () => {
            Swal.fire('Cancelado', 'El torneo ha sido eliminado de la cartelera.', 'success');
            this.load();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el torneo.', 'error')
        });
      }
    });
  }

  search(): void {
    if (this.searchForm.invalid) return;
    const fecha = this.searchForm.value.fecha as string;
    this.eventosService.searchByDate(fecha).subscribe({
      next: (result) => {
        if(result.length === 0) {
          Swal.fire('Sin resultados', 'No hay torneos en esta fecha.', 'info');
        }
        // TAMBIÉN APLICAMOS EL DETECTOR DE CAMBIOS AL BUSCADOR
        this.searchResults = [...result];
        this.cdr.detectChanges();
      },
      error: () => {
        this.searchResults = [];
        this.cdr.detectChanges();
      }
    });
  }

  eliminarDesdeHijo(id: number): void {
    this.remove(id);
    this.searchResults = this.searchResults.filter(e => e.id !== id);
    // Y REFRESCAMOS AL ELIMINAR DESDE LA BÚSQUEDA
    this.cdr.detectChanges();
  }
}