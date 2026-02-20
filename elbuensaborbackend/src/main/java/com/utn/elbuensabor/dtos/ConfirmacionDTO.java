package com.utn.elbuensabor.dtos;

import com.utn.elbuensabor.entities.FormaPago;
import com.utn.elbuensabor.entities.TipoEnvio;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ConfirmacionDTO(
        @NotNull
        TipoEnvio tipoEnvio,
        FormaPago formaPago,
        BigDecimal gastosEnvio
) {

}
