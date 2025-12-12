import axios from "axios";
import type { UnidadMedida } from "../models/UnidadMedida";

const API_URL = import.meta.env.VITE_API_URL;

export const createInsumo = async (data: any) => {
    try {
        const res = await axios.post(`${API_URL}/insumos`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al crear insumo", error);
        throw error;
    }
}

export const updateInsumo = async (id: number, data: any) => {
    try {
        const res = await axios.put(`${API_URL}/insumos/${id}`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al actualizar insumo", error);
        throw error;
    }
}

export const deleteInsumo = async (id: number) => {
    try {
        const res = await axios.delete(`${API_URL}/insumos/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error("Error al eliminar insumo", error);
        throw error;
    }
}

export const getAllUnidadesMedida = async () => {
    try {
        const res = await axios.get(`${API_URL}/unidades-medida`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al obtener unidades de medida", error);
        throw error;
    }
};

export const createUnidadMedida = async (data: UnidadMedida) => {
    try {
        const res = await axios.post(`${API_URL}/unidades-medida`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al crear unidad de medida", error);
        throw error;
    }
}

export const editUnidadMedida = async (id: number | undefined, data: UnidadMedida) => {
    try {
        const res = await axios.put(`${API_URL}/unidades-medida/${id}`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al crear unidad de medida", error);
        throw error;
    }
}

export const deleteUnidadMedida = async (id: number | undefined) => {
    try {
        const res = await axios.delete(`${API_URL}/unidades-medida/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al eliminar unidad de medida", error)
        throw error;
    }
}

export const getAll = async () => {
    try {
        const res = await axios.get(`${API_URL}/insumos`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al obtener insumos", error);
        throw error;
    }
};

export const getInsumoById = async (id: string) => {
    try {
        const res = await axios.get(`${API_URL}/insumos/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al obtener insumo", error);
        throw error;
    }
};

export const registrarCompraInsumo = async (data: any) => {
    try {
        const res = await axios.post(`${API_URL}/insumos/compras`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al registrar compra", error);
        throw error;
    }
};

export const getAllComprasInsumos = async () => {
    try {
        const res = await axios.get(`${API_URL}/insumos/compras`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al obtener compras", error);
        throw error;
    }
};