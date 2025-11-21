import axios from "axios";

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
