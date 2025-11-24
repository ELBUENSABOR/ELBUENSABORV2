import axios from "axios";
import type { UsuarioDTO } from "../dtos/UsuarioDTO";

const API_URL = import.meta.env.VITE_API_URL;

export const getUserService = async (userId: string) => {
  try {
    const res = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.error("Error al obtener el usuario", error);
    throw error;
  }
};

export const updateUser = async (userId: number, data: UsuarioDTO) => {
  try {
    const res = await axios.put(
      `${API_URL}/user/${userId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error al actualizar el usuario", error);
    throw error;
  }
};
