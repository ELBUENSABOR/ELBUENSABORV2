package com.utn.elbuensabor.dtos;

import com.utn.elbuensabor.entities.RolSistema;

public record UserDTO(Long id, String username, String email, String nombre, String apellido, String telefono, Domicilio domicilio, RolSistema rolSistema, boolean activo, Long sucursalId) {

    public record Domicilio(String calle, Integer codigoPostal, String numero, LocalidadDTO localidad) {

    }
}
