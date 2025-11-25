import axios from "axios";
import type { Sucursal } from "../models/Sucursal";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function fetchSucursales(): Promise<Sucursal[]> {
  try {
    const res = await axios.get(`${API_BASE}/sucursales`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
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
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true,
  });
};

export const getSucursalById = async (id: number) => {
  return axios.get(`${API_BASE}/sucursales/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true,
  });
};
