package com.utn.elbuensabor.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username); 

    Optional<Usuario> findByAuth0Id(String auth0Id);

    boolean existsByUsername(String username);

    @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.cliente c LEFT JOIN FETCH c.domicilio d LEFT JOIN FETCH d.localidad WHERE u.id = :id")
    Optional<Usuario> findByIdWithCliente(@Param("id") Long id);

    @Query("""
    SELECT u FROM Usuario u
    LEFT JOIN FETCH u.cliente c
    LEFT JOIN FETCH c.domicilio d
    LEFT JOIN FETCH d.localidad l
    LEFT JOIN FETCH u.empleado e
    """)
    List<Usuario> findAllWithClienteEmpleadoAndDomicilio();

    @Query("""
    SELECT u FROM Usuario u
    LEFT JOIN FETCH u.cliente c
    LEFT JOIN FETCH c.domicilio d
    LEFT JOIN FETCH d.localidad l
    LEFT JOIN FETCH u.empleado e
    WHERE u.id = :id
    """)
    Optional<Usuario> findByIdWithClienteEmpleadoAndDomicilio(Long id);
}
