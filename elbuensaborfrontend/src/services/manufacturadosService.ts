import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAll = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(`${API_URL}/manufacturados`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error al obtener manufacturados", error);
    throw error;
  }
};
