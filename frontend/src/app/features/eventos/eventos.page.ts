import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventosService } from '../../core/services/eventos.service';
import { Evento } from '../../core/models/evento.model';
// IMPORTAMOS TU NUEVO COMPONENTE HIJO
import { EventoFilaComponent } from './evento-fila.component';

@Component({
  selector: 'app-eventos-page',
  standalone: true,
  // AÑADIMOS EL COMPONENTE HIJO A LOS IMPORTS
  imports: [CommonModule, ReactiveFormsModule, EventoFilaComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Eventos</h1>
          <p>Gestiona la creación, edición y búsqueda de eventos.</p>
        </div>
        <button class="btn" (click)="load()">Actualizar</button>
      </div>

      <div class="grid two-col">
        <section class="card">
          <h2>Crear evento</h2>
          <form [formGroup]="createForm" (ngSubmit)="create()" class="form">
            <div class="grid two-col">
              <label>Fecha
                <input type="date" formControlName="fecha" />
              </label>
              <label>Hora
                <input type="time" formControlName="hora" />
              </label>
            </div>
            <label>Ubicación
              <input type="text" formControlName="lugar" placeholder="Lugar del evento" />
            </label>
            <label>Descripción
              <input type="text" formControlName="descripcion" placeholder="Opcional" />
            </label>
            <label>Capacidad máxima
              <input type="number" min="1" formControlName="capacidadMaxima" />
            </label>
            <button class="btn" type="submit" [disabled]="createForm.invalid">Crear</button>
            <p class="hint" *ngIf="createMessage">{{ createMessage }}</p>
          </form>
        </section>

        <section class="card" *ngIf="editMode">
          <h2>Actualizar evento</h2>
          <form [formGroup]="updateForm" (ngSubmit)="update()" class="form">
            <div class="grid two-col">
              <label>Fecha
                <input type="date" formControlName="fecha" />
              </label>
              <label>Hora
                <input type="time" formControlName="hora" />
              </label>
            </div>
            <label>Ubicación
              <input type="text" formControlName="lugar" />
            </label>
            <label>Descripción
              <input type="text" formControlName="descripcion" />
            </label>
            <label>Capacidad máxima
              <input type="number" min="1" formControlName="capacidadMaxima" />
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
        <h2>Listado de eventos</h2>
        <div class="table" *ngIf="eventos.length; else emptyEventos">
          <div class="table-row header">
            <span>ID</span>
            <span>Descripción</span>
            <span>Fecha</span>
            <span>Hora</span>
            <span>Ubicación</span>
            <span>Acciones</span>
          </div>
          <div class="table-row" *ngFor="let evento of eventos">
            <span [ngClass]="{'vip-row': evento.id === 1}">#{{ evento.id }}</span>
            
            <span>{{ (evento.descripcion || 'Evento') | uppercase }}</span>
            <span>{{ evento.fecha | date:'dd/MM/yyyy' }}</span>
            
            <span>{{ evento.hora }}</span>
            <span>{{ evento.lugar }}</span>
            <span class="table-actions">
              <button class="btn-link" (click)="startEdit(evento)">Editar</button>
              <button class="btn-link danger" (click)="remove(evento.id)">Eliminar</button>
            </span>
          </div>
        </div>
        <ng-template #emptyEventos>
          <p class="empty">No hay eventos registrados.</p>
        </ng-template>
      </section>

      <section class="card">
        <h2>Buscar por fecha</h2>
        <form [formGroup]="searchForm" (ngSubmit)="search()" class="form inline">
          <label>Fecha
            <input type="date" formControlName="fecha" />
          </label>
          <button class="btn" type="submit" [disabled]="searchForm.invalid">Buscar</button>
        </form>
        
        <div class="table" *ngIf="searchResults.length; else emptySearch">
          <div class="table-row header">
            <span>ID</span>
            <span>Descripción</span>
            <span>Fecha</span>
            <span>Acciones</span>
          </div>
          
          <div *ngFor="let evento of searchResults">
            <app-evento-fila 
              [eventoData]="evento" 
              (eventoSeleccionado)="eliminarDesdeHijo($event)">
            </app-evento-fila>
          </div>
          
        </div>
        <ng-template #emptySearch>
          <p class="empty">Selecciona una fecha para buscar.</p>
        </ng-template>
      </section>
    </div>
  `,
  // Añadimos unos estilos rápidos para que se note la directiva ngClass
  styles: [`
    .vip-row {
      color: #d32f2f;
      font-weight: bold;
    }
  `]
})
export class EventosPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly eventosService = inject(EventosService);

  eventos: Evento[] = [];
  searchResults: Evento[] = [];
  editMode = false;
  createMessage = '';
  updateMessage = '';
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
      next: (eventos) => (this.eventos = eventos),
      error: () => (this.eventos = [])
    });
  }

  create(): void {
    if (this.createForm.invalid) return;
    const payload = this.createForm.getRawValue() as Evento;
    this.eventosService.create(payload).subscribe({
      next: () => {
        this.createMessage = 'Evento creado correctamente.';
        this.createForm.reset({ capacidadMaxima: 20 });
        this.load();
      },
      error: (err) => (this.createMessage = err?.error?.message || 'No se pudo crear el evento.')
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
        this.updateMessage = 'Evento actualizado.';
        this.cancelEdit();
        this.load();
      },
      error: (err) => (this.updateMessage = err?.error?.message || 'No se pudo actualizar.')
    });
  }

  remove(id?: number): void {
    if (!id || !confirm('¿Eliminar este evento?')) return;
    this.eventosService.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo eliminar el evento.')
    });
  }

  search(): void {
    if (this.searchForm.invalid) return;
    const fecha = this.searchForm.value.fecha as string;
    this.eventosService.searchByDate(fecha).subscribe({
      next: (result) => (this.searchResults = result),
      error: () => (this.searchResults = [])
    });
  }

  // MÉTODO NUEVO PARA RECIBIR LA ALERTA DEL HIJO
  eliminarDesdeHijo(id: number): void {
    this.remove(id);
    // Limpiamos la búsqueda después de eliminar
    this.searchResults = this.searchResults.filter(e => e.id !== id);
  }
}