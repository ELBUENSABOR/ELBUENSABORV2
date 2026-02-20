import type { DomicilioDTO } from "./DomicilioDTO";
import type { RolSistema } from "../models/Usuario";

export interface UsuarioDTO {
    id: number;
    username: string;
    email: string;
    nombre: string;
    apellido: string;
    telefono: string;
    domicilio: DomicilioDTO;
    rolSistema: RolSistema;
    activo?: boolean;
}
