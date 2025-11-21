package com.utn.elbuensabor.dtos;

import java.math.BigDecimal;

import com.utn.elbuensabor.entities.FormaPago;
import com.utn.elbuensabor.entities.TipoEnvio;

import jakarta.validation.constraints.NotNull;

public record ConfirmacionDTO(
        @NotNull
        TipoEnvio tipoEnvio,
        FormaPago formaPago,
        BigDecimal gastosEnvio
        ) {

}
