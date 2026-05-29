export interface ContactoMensaje {
  id?: number;
  nombre: string;
  correo: string;
  asunto?: string;
  mensaje: string;
  fechaEnvio?: string;
}

export interface ContactoRecibido {
  id: number;
  emailPrincipal: string;
  estado: string;
}
