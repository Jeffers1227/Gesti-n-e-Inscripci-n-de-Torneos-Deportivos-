import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Evento } from '../../core/models/evento.model';

@Component({
  selector: 'app-evento-fila',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="event-card search-card">
      <div class="card-header">
        <span class="badge search-badge">Resultado</span>
        <h3>{{ (eventoData.descripcion || 'Evento') | uppercase }}</h3>
      </div>
      <div class="card-body">
        <p><strong>📅 Fecha:</strong> {{ eventoData.fecha | date:'dd/MM/yyyy' }}</p>
        <p><strong>⏰ Hora:</strong> {{ eventoData.hora }}</p>
        <p><strong>📍 Lugar:</strong> {{ eventoData.lugar }}</p>
      </div>
      <div class="card-footer">
        <button class="btn danger full-width" (click)="avisarAlPadre()">Eliminar este Evento</button>
      </div>
    </div>
  `,
  styles: [`
    .full-width { width: 100%; display: block; text-align: center; }
    .search-card { border: 2px dashed #007bff !important; }
    .search-badge { background-color: #007bff; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; float: right; }
  `]
})
export class EventoFilaComponent {
  @Input() eventoData!: Evento;
  @Output() eventoSeleccionado = new EventEmitter<number>();

  avisarAlPadre() {
    this.eventoSeleccionado.emit(this.eventoData.id);
  }
}