export interface User {
  userId: string;
  username: string;
  role: string;
  token: string;
}

export interface UserRequestDTO {
  username: string;
  password?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rolSistema: "CLIENTE" | "EMPLEADO" | "ADMIN";
  perfilEmpleado: "CAJERO" | "DELIVERY" | "COCINERO" | "ADMINISTRADOR";
  sucursalId: number;
  domicilio?: {
    calle: string;
    numero: string;
    codigoPostal: string | number;
    localidadId: string | number;
  };
  activo?: boolean;
}
