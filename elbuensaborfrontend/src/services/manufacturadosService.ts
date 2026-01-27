import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAll = async (sucursalId: number) => {
  try {
    const token = sessionStorage.getItem("token");
    const headers = token ? {
      Authorization: `Bearer ${token}`,
    } : {};

    const res = await axios.get(`${API_URL}/manufacturados?sucursalId=${sucursalId}`, {
      headers,
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error al obtener manufacturados", error);
    throw error;
  }
};

export const createManufacturado = async (manufacturado: any, sucursalId: number) => {
  try {
    const res = await axios.post(`${API_URL}/manufacturados?sucursalId=${sucursalId}`, manufacturado, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error al crear manufacturado", error);
    throw error;
  }
};

export const getManufacturadoById = async (id: string, sucursalId: number) => {
  try {
    const token = sessionStorage.getItem("token");
    const headers = token ? {
      Authorization: `Bearer ${token}`,
    } : {};

    const res = await axios.get(`${API_URL}/manufacturados/${id}?sucursalId=${sucursalId}`, {
      headers,
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error al obtener manufacturado", error);
    throw error;
  }
};

export const updateManufacturado = async (id: string, manufacturado: any, sucursalId: number) => {
  try {
    const res = await axios.put(`${API_URL}/manufacturados/${id}`, manufacturado, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error al actualizar manufacturado", error);
    throw error;
  }
};

export const deleteManufacturado = async (id: number) => {
  try {
    const res = await axios.delete(`${API_URL}/manufacturados/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error al eliminar manufacturado", error);
    throw error;
  }
};

export const uploadImagenesManufacturado = async (id: string, imagenes: File[]) => {
  try {
    const formData = new FormData();
    imagenes.forEach(file => formData.append("files", file));

    const res = await axios.post(`${API_URL}/manufacturados/${id}/imagenes`, formData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error al subir imágenes", error);
    throw error;
  }
};

