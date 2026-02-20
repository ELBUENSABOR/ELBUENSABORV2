export interface SucursalInsumo {
    id: number;
    sucursalId: number;
    insumoId?: number;
    stockActual: number;
    stockMinimo: number;
    stockMaximo: number;
    activo: boolean;
}