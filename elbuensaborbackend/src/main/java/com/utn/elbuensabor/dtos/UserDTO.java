package com.utn.elbuensabor.dtos;

import com.utn.elbuensabor.entities.PerfilEmpleado;
import com.utn.elbuensabor.entities.RolSistema;

import java.time.LocalDateTime;

public record UserDTO(
        Long id,
        String username,
        String email,
        String nombre,
        String apellido,
        String telefono,
        Domicilio domicilio,
        RolSistema rolSistema,
        boolean activo,
        Long sucursalId,
        PerfilEmpleado perfilEmpleado,
        String fotoPerfil,
        LocalDateTime fechaRegistro) {

    public record Domicilio(String calle, Integer codigoPostal, String numero, LocalidadDTO localidad) {

    }
}
