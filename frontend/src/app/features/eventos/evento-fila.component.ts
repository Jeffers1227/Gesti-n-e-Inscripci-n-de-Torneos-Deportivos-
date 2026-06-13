import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Evento } from '../../core/models/evento.model';

@Component({
  selector: 'app-evento-fila',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-row" style="background-color: #f9f9f9; border-left: 4px solid #007bff;">
      <span>#{{ eventoData.id }}</span>
      <span>{{ eventoData.descripcion | uppercase }}</span>
      <span>{{ eventoData.fecha | date:'shortDate' }}</span>
      <span>
        <button class="btn-link danger" (click)="avisarAlPadre()">Seleccionar</button>
      </span>
    </div>
  `
})
export class EventoFilaComponent {
  // @Input: Recibe un evento desde el componente padre (EventosPage)
  @Input() eventoData!: Evento;

  // @Output: Emite un evento hacia el componente padre
  @Output() eventoSeleccionado = new EventEmitter<number>();

  avisarAlPadre() {
    // Le enviamos el ID del evento al padre
    this.eventoSeleccionado.emit(this.eventoData.id);
  }
}