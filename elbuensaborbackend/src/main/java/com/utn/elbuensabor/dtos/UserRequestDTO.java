package com.utn.elbuensabor.dtos;

import com.utn.elbuensabor.entities.PerfilEmpleado;
import com.utn.elbuensabor.entities.RolSistema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

public record UserRequestDTO(
        @NotBlank(message = "El username es obligatorio")
        String username,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).+$",
                message = "La contraseña debe tener al menos una mayúscula, una minúscula y un símbolo"
        )
        String password,
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,
        @NotBlank(message = "El apellido es obligatorio")
        String apellido,
        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no tiene un formato válido")
        String email,
        @NotBlank(message = "El telefono es obligatorio")
        String telefono,
        @NotNull(message = "El rol es obligatorio")
        RolSistema rolSistema,
        @Valid
        DomicilioDTO domicilio,
        PerfilEmpleado perfilEmpleado,
        Long sucursalId
) {
        public boolean isSucursalValidaParaRol() {
                return rolSistema != RolSistema.EMPLEADO || sucursalId != null;
        }

        public boolean isDomicilioValidoParaRol() {
                return rolSistema != RolSistema.CLIENTE || domicilio != null;
        }

        public record DomicilioDTO(
                @NotBlank(message = "La calle es obligatoria")
                String calle,

                @NotBlank(message = "El número es obligatorio")
                String numero,

                @NotNull(message = "El código postal es obligatorio")
                Integer codigoPostal,

                @NotNull(message = "La localidad es obligatoria")
                Long localidadId
        ) {
        }
}

