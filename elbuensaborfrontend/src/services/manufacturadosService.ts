import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAll = async () => {
  try {
    const res = await axios.get(`${API_URL}/manufacturados`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error al obtener manufacturados", error);
    throw error;
  }
};
