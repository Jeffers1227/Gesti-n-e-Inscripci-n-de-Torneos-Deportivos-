import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./features/dashboard/dashboard.page').then(m => m.DashboardPage)
	},
	{
		path: 'eventos',
		loadComponent: () => import('./features/eventos/eventos.page').then(m => m.EventosPage)
	},
	{
		path: 'participantes',
		loadComponent: () => import('./features/participantes/participantes.page').then(m => m.ParticipantesPage)
	},
	{
		path: 'inscripciones',
		loadComponent: () => import('./features/inscripciones/inscripciones.page').then(m => m.InscripcionesPage)
	},
	{
		path: 'canchas',
		loadComponent: () => import('./features/canchas/canchas.page').then(m => m.CanchasPage)
	},
	{
		path: 'contactos',
		loadComponent: () => import('./features/contactos/contactos.page').then(m => m.ContactosPage)
	}
];
