import axios from "axios";
import type {UserRequestDTO} from "../models/Usuario";
import type {UserEditRequestDTO} from "../dtos/UserEditRequestDTO";

const API_URL = import.meta.env.VITE_API_URL;

export const getUserService = async (userId: string) => {
    try {
        const res = await axios.get(`${API_URL}/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res;
    } catch (error) {
        console.error("Error al obtener el usuario", error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const res = await axios.get(`${API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res;
    } catch (error) {
        console.error("Error al obtener el usuario", error);
        throw error;
    }
};

export const updateUser = async (userId: number, data: UserEditRequestDTO) => {
    try {
        const res = await axios.put(`${API_URL}/user/${userId}`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });

        return res.data;
    } catch (error) {
        console.error("Error al actualizar el usuario", error);
        throw error;
    }
};

export const createUser = async (data: UserRequestDTO) => {
    try {
        const res = await axios.post(`${API_URL}/user`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });

        return res.data;
    } catch (error) {
        console.error("Error al crear el usuario", error);
        throw error;
    }
};

export const deleteUserService = async (id: number) => {
    try {
        const res = await axios.delete(`${API_URL}/user/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al eliminar un usuario", error);
    }
};

export const reactivateUserService = async (id: number) => {
    try {
        const res = await axios.put(`${API_URL}/user/${id}/reactivar`, null, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error al reactivar un usuario", error);
        throw error;
    }
};

export const uploadProfilePhoto = async (userId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${API_URL}/user/${userId}/foto-perfil`, formData, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        withCredentials: true,
    });

    return res.data;
};
