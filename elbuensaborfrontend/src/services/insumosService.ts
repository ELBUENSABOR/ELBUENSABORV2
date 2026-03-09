import axios from "axios";
import type { UnidadMedida } from "../models/UnidadMedida";

const API_URL = import.meta.env.VITE_API_URL;

const buildAuthHeaders = () => {
    const token = sessionStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createInsumo = async (data: any) => {
    try {
        const res = await axios.post(`${API_URL}/insumos`, data, {
            headers: buildAuthHeaders(),
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
            headers: buildAuthHeaders(),
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
            headers: buildAuthHeaders(),
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al eliminar insumo", error);
        throw error;
    }
}

export const reactivateInsumo = async (id: number) => {
    try {
        const res = await axios.put(`${API_URL}/insumos/${id}/reactivar`, null, {
            headers: buildAuthHeaders(),
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al reactivar insumo", error);
        throw error;
    }
}

export const getAllUnidadesMedida = async () => {
    try {
        const res = await axios.get(`${API_URL}/unidades-medida`, {
            headers: buildAuthHeaders(),
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
            headers: buildAuthHeaders(),
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
            headers: buildAuthHeaders(),
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
            headers: buildAuthHeaders(),
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
            headers: buildAuthHeaders(),
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
            headers: buildAuthHeaders(),
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
            headers: buildAuthHeaders(),
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
            headers: buildAuthHeaders(),
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al obtener compras", error);
        throw error;
    }
};

export const uploadImagenesInsumo = async (id: string, files: File[]) => {
    try {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const res = await axios.post(`${API_URL}/insumos/${id}/imagenes`, formData, {
            headers: {
                ...buildAuthHeaders(),
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al subir imágenes", error);
        throw error;
    }
};