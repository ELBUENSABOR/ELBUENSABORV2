export interface User {
    userId: string;
    username: string;
    role: string;
    subRole: string | null;
    token: string;
    mustChangePassword: boolean;
    sucursalId?: number | null;
}

export type RolSistema = "CLIENTE" | "EMPLEADO" | "ADMIN";
export type PerfilEmpleado = "CAJERO" | "DELIVERY" | "COCINERO" | "ADMINISTRADOR";

export interface UserRequestDTO {
    username: string;
    password?: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    rolSistema: RolSistema;
    perfilEmpleado?: PerfilEmpleado;
    sucursalId?: number;
    domicilio?: {
        calle: string;
        numero: string;
        codigoPostal: number;
        localidadId: number;
    };
    activo?: boolean;
}
