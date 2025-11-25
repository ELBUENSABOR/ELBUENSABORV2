import type { LocalidadDTO } from "./LocalidadDTO";

export interface DomicilioDTO {
  calle: string;
  codigoPostal: number;
  numero: string;
  localidad: LocalidadDTO;
}