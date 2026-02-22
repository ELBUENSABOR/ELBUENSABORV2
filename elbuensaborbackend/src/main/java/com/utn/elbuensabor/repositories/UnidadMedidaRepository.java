package com.utn.elbuensabor.repositories;

import com.utn.elbuensabor.entities.UnidadMedida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UnidadMedidaRepository extends JpaRepository<UnidadMedida, Long> {
    List<UnidadMedida> findAllByActivoTrue();
}
