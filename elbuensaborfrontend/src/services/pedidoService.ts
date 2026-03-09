import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_ORIGIN = API_URL ? new URL(API_URL).origin : "";

export interface PedidoDetalleDTO {
    manufacturadoId?: number;
    insumoId?: number;
    cantidad: number;
}

export interface PedidoRequest {
    clienteId: number;
    sucursalId: number;
    tipoEnvio: "TAKE_AWAY" | "DELIVERY";
    formaPago: "EFECTIVO" | "MP";
    detalles: PedidoDetalleDTO[];
    descuento?: number;
    observaciones?: string;
    direccionEntrega?: string;
    telefonoEntrega?: string;
}

export interface PedidoResponse {
    id: number;
    numero: string;
    fechaPedido: string;
    horaEstimadaFinalizacion: string;
    subTotal: number;
    descuento: number;
    gastosEnvio: number;
    total: number;
    totalCosto: number;
    pagado: boolean;
    observaciones: string;
    direccionEntrega?: string | null;
    telefonoEntrega?: string | null;
    estado: string;
    tipoEnvio: "DELIVERY" | "TAKE_AWAY";
    formaPago: "EFECTIVO" | "MP";
    cliente: {
        id: number;
        nombre: string;
        apellido: string;
        email: string;
    };
    empleado?: {
        id: number;
        nombre: string;
        apellido: string;
    };
    sucursal: {
        id: number;
        nombre: string;
    };
    factura?: {
        id: number;
        numeroComprobante: string;
        fechaFacturacion: string;
        totalVenta: number;
        pdfUrl?: string | null;
    } | null;
    notaCredito?: {
        id: number;
        numeroComprobante: string;
        fechaEmision: string;
        total: number;
        pdfUrl?: string | null;
    } | null;
    detalles: {
        id: number;
        articulo: {
            id: number;
            denominacion: string;
            tipo: string;
        };
        cantidad: number;
        precioUnit: number;
        subTotal: number;
    }[];
}

export const createPedido = async (pedido: PedidoRequest) => {
    try {
        const token = sessionStorage.getItem("token");

        const res = await axios.post(
            `${API_URL}/pedidos`,
            pedido,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        return res.data;
    } catch (error: any) {
        console.error(
            "Error al crear pedido:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const getPedidoById = async (id: number): Promise<PedidoResponse> => {
    try {
        const token = sessionStorage.getItem("token");

        const res = await axios.get(
            `${API_URL}/pedidos/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        return res.data;
    } catch (error: any) {
        console.error(
            "Error al obtener pedido:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const getPedidosByCliente = async (clienteId: number): Promise<PedidoResponse[]> => {
    try {
        const token = sessionStorage.getItem("token");

        const res = await axios.get(
            `${API_URL}/pedidos`,
            {
                params: { clienteId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        return res.data;
    } catch (error: any) {
        console.error(
            "Error al obtener pedidos del cliente:",
            error.response?.data || error.message
        );
        throw error;
    }
};
export const getPedidosAll = async (
    estado?: string,
    sucursalId?: number | null
): Promise<PedidoResponse[]> => {
    try {
        const token = sessionStorage.getItem("token");
        const params: Record<string, string | number> = {};
        if (estado) {
            params.estado = estado;
        }
        if (sucursalId !== null && sucursalId !== undefined) {
            params.sucursalId = sucursalId;
        }

        const res = await axios.get(
            `${API_URL}/pedidos`,
            {
                params: Object.keys(params).length ? params : undefined,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        return res.data;
    } catch (error: any) {
        console.error(
            "Error al obtener pedidos:",
            error.response?.data || error.message
        );
        throw error;
    }
};
export const cambiarEstadoPedido = async (pedidoId: number, estado: string): Promise<PedidoResponse> => {
    try {
        const token = sessionStorage.getItem("token");

        const res = await axios.put(
            `${API_URL}/pedidos/${pedidoId}/estado`,
            { estado },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        return res.data;
    } catch (error: any) {
        console.error(
            "Error al cambiar estado del pedido:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const resolveFacturaPdfUrl = (pdfUrl?: string | null) => {
    if (!pdfUrl) return null;
    if (/^https?:\/\//i.test(pdfUrl)) return pdfUrl;
    if (!API_ORIGIN) return pdfUrl;
    return pdfUrl.startsWith("/")
        ? `${API_ORIGIN}${pdfUrl}`
        : `${API_ORIGIN}/${pdfUrl}`;
};

export const marcarPedidoPagado = async (pedidoId: number): Promise<PedidoResponse> => {
    try {
        const token = sessionStorage.getItem("token");

        const res = await axios.put(
            `${API_URL}/pedidos/${pedidoId}/pagado`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        return res.data;
    } catch (error: any) {
        console.error(
            "Error al marcar pedido como pagado:",
            error.response?.data || error.message
        );
        throw error;
    }
};
export const emitirNotaCredito = async (pedidoId: number): Promise<PedidoResponse> => {
    try {
        const token = sessionStorage.getItem("token");

        const requestConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        };

        let res;
        try {
            res = await axios.put(
                `${API_URL}/pedidos/${pedidoId}/nota-credito`,
                {},
                requestConfig
            );
        } catch (error: any) {
            if (error?.response?.status !== 404) {
                throw error;
            }

            res = await axios.put(
                `${API_URL}/pedidos/${pedidoId}/estado`,
                { estado: "CANCELADO" },
                requestConfig
            );
        }

        return res.data;
    } catch (error: any) {
        console.error(
            "Error al emitir nota de crédito:",
            error.response?.data || error.message
        );
        throw error;
    }
};
