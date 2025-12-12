import axios from "axios";
import type { RegisterRequest } from "../dtos/RegisterRequest";
import type { LoginRequest } from "../dtos/LoginRequest";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (data: RegisterRequest) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, data, {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.error("Error al registrar", error);
    throw error;
  }
};

export const loginUser = async (data: LoginRequest) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, data, {
      withCredentials: true,
    });
    console.log(res);
    return res;
  } catch (error) {
    console.error("Error al iniciar sesion", error);
    throw error;
  }
};

export const getLocalidades = async () => {
  try {
    const res = await axios.get(`${API_URL}/localidad`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error al obtener localidades", error);
    throw error;
  }
};
