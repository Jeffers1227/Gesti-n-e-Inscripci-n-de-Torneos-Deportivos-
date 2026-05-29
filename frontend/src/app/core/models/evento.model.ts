export interface Evento {
  id?: number;
  fecha: string;
  hora: string;
  lugar: string;
  descripcion?: string;
  capacidadMaxima?: number;
}
