import axios from "axios";

export interface ProductoVendidoDTO {
    nombre: string;
    cantidad: number;
}

export interface ReporteProductosVendidosDTO {
    productosCocina: ProductoVendidoDTO[];
    bebidas: ProductoVendidoDTO[];
}

export interface ReporteClientesPedidosDTO {
    clienteId: number;
    nombre: string;
    apellido: string;
    email: string;
    cantidadPedidos: number;
    totalPedidos: number;
}

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function fetchProductosMasVendidos(
    desde: string,
    hasta: string
): Promise<ReporteProductosVendidosDTO> {
    const token = sessionStorage.getItem("token");
    const headers = token
        ? {
            Authorization: `Bearer ${token}`,
        }
        : {};
    const response = await axios.get(`${API_BASE}/reportes/productos-mas-vendidos`, {
        headers,
        withCredentials: true,
        params: {
            desde,
            hasta,
        },
    });
    return response.data;
}

export async function fetchClientesPorPedidos(
    desde: string,
    hasta: string,
    orden: "PEDIDOS" | "TOTAL"
): Promise<ReporteClientesPedidosDTO[]> {
    const token = sessionStorage.getItem("token");
    const headers = token
        ? {
            Authorization: `Bearer ${token}`,
        }
        : {};
    const response = await axios.get(`${API_BASE}/reportes/clientes-por-pedidos`, {
        headers,
        withCredentials: true,
        params: {
            desde,
            hasta,
            orden,
        },
    });
    return response.data;
}