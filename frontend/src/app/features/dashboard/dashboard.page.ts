import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard-container">
      
      <header class="hero-banner">
        <div class="hero-content">
          <h1>⚡ Centro de Mando</h1>
          <p>Bienvenido al panel de administración. Selecciona un módulo para empezar a gestionar tus torneos relámpagos.</p>
        </div>
      </header>

      <div class="modules-grid">
        
        <a class="module-card card-eventos" routerLink="/eventos">
          <div class="card-icon">🏆</div>
          <div class="card-info">
            <h3>Torneos</h3>
            <p>Crea, edita y administra la cartelera de eventos.</p>
          </div>
          <div class="card-arrow">➔</div>
        </a>

        <a class="module-card card-inscripciones" routerLink="/inscripciones">
          <div class="card-icon">🎟️</div>
          <div class="card-info">
            <h3>Inscripciones</h3>
            <p>Registra equipos en los torneos disponibles.</p>
          </div>
          <div class="card-arrow">➔</div>
        </a>

        <a class="module-card card-participantes" routerLink="/participantes">
          <div class="card-icon">🏃‍♂️</div>
          <div class="card-info">
            <h3>Jugadores</h3>
            <p>Directorio de atletas y capitanes de equipo.</p>
          </div>
          <div class="card-arrow">➔</div>
        </a>

        <a class="module-card card-canchas" routerLink="/canchas">
          <div class="card-icon">🏟️</div>
          <div class="card-info">
            <h3>Canchas</h3>
            <p>Gestiona sedes, superficies y precios.</p>
          </div>
          <div class="card-arrow">➔</div>
        </a>

        <a class="module-card card-contactos" routerLink="/contactos">
          <div class="card-icon">📬</div>
          <div class="card-info">
            <h3>Bandeja</h3>
            <p>Revisa los mensajes y consultas de los usuarios.</p>
          </div>
          <div class="card-arrow">➔</div>
        </a>

      </div>
    </div>
  `,
  styles: [`
    /* CONTENEDOR PRINCIPAL */
    .dashboard-container {
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
      font-family: 'Segoe UI', Roboto, Helvetica, sans-serif;
    }

    /* BANNER DE BIENVENIDA (HERO) */
    .hero-banner {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: 20px;
      padding: 3rem 2rem;
      color: white;
      text-align: center;
      margin-bottom: 3rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }

    /* Efecto de brillo en el banner */
    .hero-banner::after {
      content: '';
      position: absolute;
      top: -50%; right: -20%;
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%);
      border-radius: 50%;
    }

    .hero-content h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0 0 1rem 0;
      letter-spacing: -0.5px;
      background: linear-gradient(to right, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-content p {
      font-size: 1.1rem;
      color: #94a3b8;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* GRID DE MÓDULOS */
    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    /* TARJETAS INTERACTIVAS */
    .module-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #334155;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    /* EFECTOS DE HOVER (MAGIA VISUAL) */
    .module-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      z-index: 10;
    }

    .module-card:hover .card-arrow {
      transform: translateX(5px);
      opacity: 1;
    }

    /* BORDES INFERIORES DE COLORES POR MÓDULO */
    .card-eventos { border-bottom: 4px solid #f97316; }
    .card-inscripciones { border-bottom: 4px solid #10b981; }
    .card-participantes { border-bottom: 4px solid #6366f1; }
    .card-canchas { border-bottom: 4px solid #0ea5e9; }
    .card-contactos { border-bottom: 4px solid #f43f5e; }

    /* CONTENIDO DE LA TARJETA */
    .card-icon {
      font-size: 3rem;
      margin-right: 1.5rem;
      filter: drop-shadow(0 4px 3px rgba(0,0,0,0.1));
    }

    .card-info h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #0f172a;
    }

    .card-info p {
      margin: 0;
      font-size: 0.9rem;
      color: #64748b;
      line-height: 1.4;
    }

    .card-arrow {
      margin-left: auto;
      font-size: 1.5rem;
      color: #cbd5e1;
      opacity: 0.5;
      transition: all 0.3s ease;
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .hero-content h1 { font-size: 2rem; }
      .module-card { flex-direction: column; text-align: center; }
      .card-icon { margin-right: 0; margin-bottom: 1rem; }
      .card-arrow { display: none; }
    }
  `]
})
export class DashboardPage {}