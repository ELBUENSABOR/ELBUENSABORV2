package com.utn.elbuensabor.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.utn.elbuensabor.entities.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username); 

    boolean existsByUsername(String username);

    @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.cliente c LEFT JOIN FETCH c.domicilio d LEFT JOIN FETCH d.localidad WHERE u.id = :id")
    Optional<Usuario> findByIdWithCliente(@Param("id") Long id);

    @Query(""" 
    SELECT u FROM Usuario u
    LEFT JOIN FETCH u.cliente c
    LEFT JOIN FETCH c.domicilio d
    LEFT JOIN FETCH d.localidad
    WHERE u.id = :id
    """)
    Optional<Usuario> findByIdWithClienteAndDomicilio(@Param("id") Long id);
}
