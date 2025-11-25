package com.utn.elbuensabor.dtos;

public record UserDTO(Long id, String username, String email, String nombre, String apellido, String telefono, Domicilio domicilio) {

    public record Domicilio(String calle, Integer codigoPostal, String numero, LocalidadDTO localidad) {

    }
}
