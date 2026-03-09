import axios from "axios";
import type { Sucursal } from "../models/Sucursal";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function fetchSucursales(): Promise<Sucursal[]> {
    try {
        const token = sessionStorage.getItem("token");
        const headers = token ? {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
        } : {};
        const res = await axios.get(`${API_BASE}/sucursales`, {
            headers,
            //withCredentials: true,
        });
        return res.data;
    } catch (error: any) {
        console.error(
            "Error en fetchSucursales:",
            error.response?.data || error.message
        );
        throw error;
    }
}

export const createSucursal = async (data: Sucursal) => {
    return axios.post(`${API_BASE}/sucursales`, data, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        withCredentials: true,
    });
};

export const getSucursalById = async (id: number) => {
    const token = sessionStorage.getItem("token");
    const headers = token ? {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
    } : {};
    return axios.get(`${API_BASE}/sucursales/${id}`, {
        headers,
        withCredentials: true,
    });
};

export const updateSucursal = async (id: number, data: Sucursal) => {
    return axios.put(`${API_BASE}/sucursales/${id}`, data, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        withCredentials: true,
    });
};

export const deleteSucursal = async (id: number) => {
    return axios.delete(`${API_BASE}/sucursales/${id}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        withCredentials: true,
    });
};