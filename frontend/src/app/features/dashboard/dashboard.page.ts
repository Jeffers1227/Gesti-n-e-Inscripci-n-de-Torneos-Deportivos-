import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Panel principal</h1>
          <p>Gestiona eventos, participantes e inscripciones desde un solo lugar.</p>
        </div>
      </div>

      <div class="grid three-col">
        <a class="card card-link" routerLink="/eventos">
          <h3>Eventos</h3>
          <p>Crear, editar y buscar eventos por fecha.</p>
        </a>
        <a class="card card-link" routerLink="/participantes">
          <h3>Participantes</h3>
          <p>Administrar participantes y su información.</p>
        </a>
        <a class="card card-link" routerLink="/inscripciones">
          <h3>Inscripciones</h3>
          <p>Registrar participantes en eventos.</p>
        </a>
        <a class="card card-link" routerLink="/canchas">
          <h3>Canchas</h3>
          <p>Registrar canchas y ubicaciones.</p>
        </a>
        <a class="card card-link" routerLink="/contactos">
          <h3>Contactos</h3>
          <p>Mensajes y consultas de contacto.</p>
        </a>
      </div>
    </div>
  `
})
export class DashboardPage {}
