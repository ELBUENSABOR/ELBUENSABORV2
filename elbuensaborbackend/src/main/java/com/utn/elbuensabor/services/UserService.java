package com.utn.elbuensabor.services;

import org.springframework.stereotype.Service;

import com.utn.elbuensabor.dtos.LocalidadDTO;
import com.utn.elbuensabor.dtos.UserDTO;
import com.utn.elbuensabor.entities.Cliente;
import com.utn.elbuensabor.repositories.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UsuarioRepository usuarioRepository;

    public UserDTO getUser(Long id) {
        return usuarioRepository.findByIdWithCliente(id)
                .map(u -> {
                    Cliente cliente = u.getCliente();
                    if (cliente == null) {
                        throw new RuntimeException("El usuario no tiene un cliente asociado");
                    }
                    
                    var domicilio = cliente.getDomicilio();
                    if (domicilio == null) {
                        throw new RuntimeException("El cliente no tiene un domicilio asociado");
                    }
                    
                    var localidad = domicilio.getLocalidad();
                    if (localidad == null) {
                        throw new RuntimeException("El domicilio no tiene una localidad asociada");
                    }
                    
                    return new UserDTO(
                            u.getId(),
                            u.getUsername(),
                            cliente.getEmail(),
                            cliente.getNombre(),
                            cliente.getApellido(),
                            cliente.getTelefono(),
                            new UserDTO.Domicilio(
                                    domicilio.getCalle(),
                                    domicilio.getCodigoPostal(),
                                    new LocalidadDTO(localidad.getId(), localidad.getNombre())
                            )
                    );
                })
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
