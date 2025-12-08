import type { Imagen } from "./Imagen";
import type { ManufacturadoDetalles } from "./ManufacturadoDetalles";
import type { Rubro } from "./Rubro";
import type { Sucursal } from "./Sucursal";

export interface Manufacturado {
  id: number;
  denominacion: string;
  precioCosto: number;
  precioVenta: number;
  categoria: Rubro;
  tiempoEstimado: number;
  activo: boolean;
  sucursal: Sucursal;
  detalles: ManufacturadoDetalles[];
  imagenes: Imagen[];
}
