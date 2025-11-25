import type { DomicilioDTO } from "./DomicilioDTO";

export interface UsuarioDTO {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  domicilio: DomicilioDTO;
}
