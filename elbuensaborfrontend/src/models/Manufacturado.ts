export interface Manufacturado {
    id: number;
    denominacion: string;
    descripcion: string;
    receta: string;
    precioCosto: number;
    precioVenta: number;
    categoriaId: number;
    categoria: string;
    tiempoEstimado: number;
    activo: boolean;
    ingredientes: {
        unidadMedida: string;
        insumoId: number;
        denominacion: string;
        cantidad: number;
        precioCompra: number;
        sucursalId?: number;
    }[];
    imagenes: string[];
    disponible?: boolean;
}