import axios from "axios";
import type {Rubro} from "../models/Rubro";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export const getRubrosInsumos = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
        const res = await axios.get(`${API_BASE}/insumos/rubros`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getRubroInsumoById = async (id: number) => {
    // eslint-disable-next-line no-useless-catch
    try {
        return axios.get(`${API_BASE}/insumos/rubros/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
    } catch (error) {
        throw error;
    }
};

export const createRubro = async (data: Rubro) => {
    // eslint-disable-next-line no-useless-catch
    try {
        return axios.post(`${API_BASE}/insumos/rubros`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
    } catch (error) {
        throw error;
    }
};

export const updateRubro = async (id: number, data: Rubro) => {
    // eslint-disable-next-line no-useless-catch
    try {
        return axios.put(`${API_BASE}/insumos/rubros/${id}`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
    } catch (error) {
        throw error;
    }
};

export const getRubrosManufacturados = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
        return axios.get(`${API_BASE}/manufacturados/rubros`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
    } catch (error) {
        throw error;
    }
};

export const getRubroManufacturadoById = async (id: number) => {
    // eslint-disable-next-line no-useless-catch
    try {
        return axios.get(`${API_BASE}/manufacturados/rubros/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
    } catch (error) {
        throw error;
    }
};

export const createRubroManufacturado = async (data: Rubro) => {
    // eslint-disable-next-line no-useless-catch
    try {
        return axios.post(`${API_BASE}/manufacturados/rubros`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
    } catch (error) {
        throw error;
    }
};

export const updateRubroManufacturado = async (id: number, data: Rubro) => {
    // eslint-disable-next-line no-useless-catch
    try {
        return axios.put(`${API_BASE}/manufacturados/rubros/${id}`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
    } catch (error) {
        throw error;
    }
};

export const deleteRubroInsumoService = async (id: number) => {
    // eslint-disable-next-line no-useless-catch
    try {
        return axios.delete(`${API_BASE}/insumos/rubros/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
    } catch (error) {
        throw error;
    }
};

export const deleteRubroManufacturadoService = async (id: number) => {
    // eslint-disable-next-line no-useless-catch
    try {
        return axios.delete(`${API_BASE}/manufacturados/rubros/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
    } catch (error) {
        throw error;
    }
};

