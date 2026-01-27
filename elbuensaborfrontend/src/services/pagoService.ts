import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const pagarConMercadoPago = (pedidoId: number) => {
  try {
    return axios.post(
      `${API_URL}/pagos/mercadopago/${pedidoId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    );
  } catch (error) {
    console.log(error);
  }

};
