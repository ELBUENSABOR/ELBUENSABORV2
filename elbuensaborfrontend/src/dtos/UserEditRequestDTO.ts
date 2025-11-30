export interface UserEditRequestDTO {
    username: string;
    password?: string | null; // opcional
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    rolSistema: string; // "CLIENTE" | "EMPLEADO" | "ADMIN"
    domicilio: {
        calle: string;
        numero: string;
        codigoPostal: number;
        localidadId: number;
    };
    perfilEmpleado?: string | null;
    sucursalId: number;
}
