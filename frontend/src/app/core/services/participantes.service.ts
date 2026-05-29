import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Participante } from '../models/participante.model';

@Injectable({ providedIn: 'root' })
export class ParticipantesService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Participante[]> {
    return this.http.get<Participante[]>(`${this.baseUrl}/participantes`);
  }

  create(participante: Participante): Observable<Participante> {
    return this.http.post<Participante>(`${this.baseUrl}/participantes`, participante);
  }

  update(id: number, participante: Participante): Observable<Participante> {
    return this.http.put<Participante>(`${this.baseUrl}/participantes/${id}`, participante);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/participantes/${id}`);
  }
}
