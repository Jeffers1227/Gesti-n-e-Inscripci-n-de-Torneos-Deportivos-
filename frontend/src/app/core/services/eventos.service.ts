import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Evento } from '../models/evento.model';

@Injectable({ providedIn: 'root' })
export class EventosService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/eventos`);
  }

  create(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.baseUrl}/eventos`, evento);
  }

  update(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/eventos/${id}`, evento);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eventos/${id}`);
  }

  searchByDate(fecha: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/eventos/fecha/${fecha}`);
  }
}
