import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cancha } from '../models/cancha.model';

@Injectable({ providedIn: 'root' })
export class CanchasService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Cancha[]> {
    return this.http.get<Cancha[]>(`${this.baseUrl}/canchas`);
  }

  create(cancha: Cancha): Observable<Cancha> {
    return this.http.post<Cancha>(`${this.baseUrl}/canchas`, cancha);
  }

  update(id: number, cancha: Cancha): Observable<Cancha> {
    return this.http.put<Cancha>(`${this.baseUrl}/canchas/${id}`, cancha);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/canchas/${id}`);
  }
}
