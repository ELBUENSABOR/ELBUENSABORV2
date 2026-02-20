package com.utn.elbuensabor.services;

import com.utn.elbuensabor.dtos.RegistroCompraDTO;
import com.utn.elbuensabor.dtos.RegistroCompraRequest;
import java.util.List;

public interface CompraInsumoService {

    List<RegistroCompraDTO> getAllRegistros();

    void registrarCompra(RegistroCompraRequest request);
}
