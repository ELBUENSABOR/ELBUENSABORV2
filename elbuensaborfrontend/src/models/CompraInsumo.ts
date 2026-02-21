import type { Sucursal } from "./Sucursal";
import type { InsumoResponse } from "./Insumo";

export interface CompraInsumo {
    id: number;
    sucursal: Sucursal;
    insumo: InsumoResponse;
    cantidad: number;
    precioCompra: number;
    totalCompra: number;
    fechaCompra: string;
}