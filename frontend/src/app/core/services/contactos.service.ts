import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactoMensaje, ContactoRecibido } from '../models/contacto.model';

@Injectable({ providedIn: 'root' })
export class ContactosService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  listMensajes(): Observable<ContactoMensaje[]> {
    return this.http.get<ContactoMensaje[]>(`${this.baseUrl}/contacto/mensajes`);
  }

  create(mensaje: ContactoMensaje): Observable<ContactoRecibido> {
    return this.http.post<ContactoRecibido>(`${this.baseUrl}/contacto`, mensaje);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/contacto/mensajes/${id}`);
  }
}
