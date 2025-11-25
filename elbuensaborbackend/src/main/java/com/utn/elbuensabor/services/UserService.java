package com.utn.elbuensabor.services;

import com.utn.elbuensabor.entities.Domicilio;
import com.utn.elbuensabor.entities.Localidad;
import com.utn.elbuensabor.entities.Usuario;
import com.utn.elbuensabor.repositories.LocalidadRepository;
import org.apache.catalina.User;
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
    private final LocalidadRepository localidadRepository;

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
                                    domicilio.getNumero(),
                                    new LocalidadDTO(localidad.getId(), localidad.getNombre())
                            )
                    );
                })
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {

        Usuario usuario = usuarioRepository.findByIdWithClienteAndDomicilio(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // =============================
        // ACTUALIZAR USUARIO
        // =============================
        usuario.setUsername(userDTO.username());
        usuario.setActivo(true);

        // =============================
        // ACTUALIZAR CLIENTE
        // =============================
        Cliente cliente = usuario.getCliente();
        if (cliente != null) {
            cliente.setNombre(userDTO.nombre());
            cliente.setApellido(userDTO.apellido());
            cliente.setTelefono(userDTO.telefono());
            cliente.setEmail(userDTO.email());
        }

        // =============================
        // ACTUALIZAR DOMICILIO
        // =============================
        if (cliente != null && userDTO.domicilio() != null) {

            UserDTO.Domicilio dom = userDTO.domicilio();

            // si no tiene domicilio, lo creo
            if (cliente.getDomicilio() == null) {
                cliente.setDomicilio(new Domicilio());
            }

            Domicilio domicilio = cliente.getDomicilio();

            domicilio.setCalle(dom.calle());
            domicilio.setNumero(dom.numero());
            domicilio.setCodigoPostal(dom.codigoPostal());

            // =============================
            // LOCALIDAD SEGURA
            // =============================
            if (dom.localidad() != null) {
                LocalidadDTO l = dom.localidad();

                // buscar localidad real
                Localidad localidad = localidadRepository.findById(l.id())
                        .orElseThrow(() -> new RuntimeException("Localidad no encontrada"));

                // asignarlas
                domicilio.setLocalidad(localidad);
            }
        }

        // =============================
        // GUARDAR
        // =============================
        usuarioRepository.save(usuario);

        // =============================
        // DEVOLVER DTO
        // =============================
        return new UserDTO(
                usuario.getId(),
                usuario.getUsername(),
                cliente != null ? cliente.getEmail() : null,
                cliente != null ? cliente.getNombre() : null,
                cliente != null ? cliente.getApellido() : null,
                cliente != null ? cliente.getTelefono() : null,
                cliente != null && cliente.getDomicilio() != null
                        ? new UserDTO.Domicilio(
                        cliente.getDomicilio().getCalle(),
                        cliente.getDomicilio().getCodigoPostal(),
                        cliente.getDomicilio().getNumero(),
                        cliente.getDomicilio().getLocalidad() != null
                                ? new LocalidadDTO(
                                cliente.getDomicilio().getLocalidad().getId(),
                                cliente.getDomicilio().getLocalidad().getNombre()
                        )
                                : null
                )
                        : null
        );
    }

}
