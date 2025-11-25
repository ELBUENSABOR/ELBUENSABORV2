package com.utn.elbuensabor.dtos;

import com.utn.elbuensabor.entities.PerfilEmpleado;
import com.utn.elbuensabor.entities.RolSistema;

public record UserRequestDTO(
        String username,
        String password,
        String nombre,
        String apellido,
        String email,
        String telefono,
        RolSistema rolSistema,
        DomicilioDTO domicilio,
        PerfilEmpleado perfilEmpleado,
        Long sucursalId
) {
    public record DomicilioDTO(
            String calle,
            String numero,
            Integer codigoPostal,
            Long localidadId
    ) {}
}

