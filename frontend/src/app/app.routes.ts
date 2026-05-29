import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
	{
		path: 'login',
		loadComponent: () => import('./features/auth/login.page').then(m => m.LoginPage)
	},
	{
		path: '',
		loadComponent: () => import('./features/dashboard/dashboard.page').then(m => m.DashboardPage),
		canActivate: [authGuard]
	},
	{
		path: 'eventos',
		loadComponent: () => import('./features/eventos/eventos.page').then(m => m.EventosPage),
		canActivate: [authGuard]
	},
	{
		path: 'participantes',
		loadComponent: () => import('./features/participantes/participantes.page').then(m => m.ParticipantesPage),
		canActivate: [authGuard]
	},
	{
		path: 'inscripciones',
		loadComponent: () => import('./features/inscripciones/inscripciones.page').then(m => m.InscripcionesPage),
		canActivate: [authGuard]
	},
	{
		path: 'canchas',
		loadComponent: () => import('./features/canchas/canchas.page').then(m => m.CanchasPage),
		canActivate: [authGuard]
	},
	{
		path: 'contactos',
		loadComponent: () => import('./features/contactos/contactos.page').then(m => m.ContactosPage),
		canActivate: [authGuard]
	}
];
