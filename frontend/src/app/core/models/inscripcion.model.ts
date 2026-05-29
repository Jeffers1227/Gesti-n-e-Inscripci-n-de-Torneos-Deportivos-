export interface Inscripcion {
  id?: number;
  eventoId: number;
  participanteId: number;
  equipo?: string;
  fechaInscripcion?: string;
  estado?: string;
}
