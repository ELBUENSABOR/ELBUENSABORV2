import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const pagarConMercadoPago = async (pedidoId: number) => {
  const response = await axios.post(
    `${API_URL}/pagos/mercadopago/${pedidoId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      //withCredentials: true,
    },
  );

  const { initPoint } = response.data;

  if (!initPoint) {
    throw new Error("No se recibió initPoint de Mercado Pago");
  }

  window.location.href = initPoint; // 🔑 único redirect
};

export const verificarPago = async (pedidoId: number, paymentId?: string | null) => {
  try {
    return await axios.get(
      `${API_URL}/pagos/mercadopago/verificar/${pedidoId}`,
      {
        params: paymentId ? { paymentId } : undefined,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        //withCredentials: true,
      },
    );
  } catch (error) {
    console.log(error);
  }
};
