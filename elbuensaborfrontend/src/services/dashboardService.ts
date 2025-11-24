const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export interface SucursalOption {
  id: number;
  nombre: string;
  horarioApertura?: string;
  horarioCierre?: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error("Hubo un error al comunicarse con el servidor");
  }
  return response.json();
}

export async function fetchSucursales(token: string): Promise<SucursalOption[]> {
  const response = await fetch(`${API_BASE}/api/sucursales`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
}
