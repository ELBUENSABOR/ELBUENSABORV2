import type { Imagen } from "./Imagen";
import type { Rubro } from "./Rubro";
import type { SucursalInsumo } from "./SucursalInsumo";
import type { UnidadMedida } from "./UnidadMedida";

export interface InsumoRequest {
    id?: number;
    denominacion: string;
    precioCompra: number;
    precioVenta: number;
    esParaElaborar: boolean;
    categoriaId: number;
    unidadMedidaId: number;
    tiempoEstimado: number;
    activo: boolean;
    imagenes: Array<Imagen | string>;
    stockSucursal: SucursalInsumo[];
}

export interface InsumoResponse {
    id?: number;
    denominacion: string;
    precioCompra: number;
    precioVenta: number;
    esParaElaborar: boolean;
    categoria: Rubro;
    unidadMedida: UnidadMedida;
    tiempoEstimado: number;
    activo: boolean;
    imagenes: Array<Imagen | string>;
    stockSucursal: SucursalInsumoDto[];
}

export interface SucursalInsumoDto {
    sucursalId: number;
    stockActual: number;
    stockMinimo: number;
    stockMaximo: number;
}