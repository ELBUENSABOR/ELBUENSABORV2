import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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

export const getPedidoById = async (id: number) => {
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

export const getPedidosByCliente = async (clienteId: number) => {
    try {
        const token = sessionStorage.getItem("token");

        const res = await axios.get(
            `${API_URL}/pedidos/cliente/${clienteId}`,
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
            "Error al obtener pedidos del cliente:",
            error.response?.data || error.message
        );
        throw error;
    }
};