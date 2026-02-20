package com.utn.elbuensabor.dtos;

import com.utn.elbuensabor.entities.PerfilEmpleado;
import com.utn.elbuensabor.entities.RolSistema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserEditRequestDTO(
        @NotBlank(message = "El username es obligatorio")
        String username,
        String password,
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,
        @NotBlank(message = "El apellido es obligatorio")
        String apellido,
        @NotBlank(message = "El email es obligatorio")
        String email,
        @NotBlank(message = "El telefono es obligatorio")
        String telefono,
        @NotNull(message = "El rol es obligatorio")
        RolSistema rolSistema,
        @Valid
        UserRequestDTO.DomicilioDTO domicilio,
        PerfilEmpleado perfilEmpleado,
        Long sucursalId,
        String fotoPerfil
) {
    public record DomicilioDTO(
            @NotBlank(message = "La calle es obligatoria")
            String calle,

            @NotBlank(message = "El número es obligatorio")
            String numero,

            @NotNull(message = "El código postal es obligatorio")
            Integer codigoPostal,

            @NotNull(message = "La localidad es obligatoria")
            Long localidadId
    ) {}

}
