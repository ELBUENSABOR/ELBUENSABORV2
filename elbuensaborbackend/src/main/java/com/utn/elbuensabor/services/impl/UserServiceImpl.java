package com.utn.elbuensabor.services.impl;

import com.utn.elbuensabor.dtos.UserEditRequestDTO;
import com.utn.elbuensabor.dtos.UserRequestDTO;
import com.utn.elbuensabor.entities.*;
import com.utn.elbuensabor.repositories.*;
import com.utn.elbuensabor.services.UserService;
import org.apache.catalina.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.utn.elbuensabor.dtos.LocalidadDTO;
import com.utn.elbuensabor.dtos.UserDTO;

import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UsuarioRepository usuarioRepository;
    private final LocalidadRepository localidadRepository;
    private final PasswordEncoder encoder;
    private final ClienteRepository clienteRepository;
    private final EmpleadoRepository empleadoRepository;
    private final SucursalEmpresaRepository sucursalEmpresaRepository;

    public UserDTO createUser(UserRequestDTO dto) {

        Usuario usuario = new Usuario();
        usuario.setUsername(dto.username());
        usuario.setPassword(encoder.encode(dto.password()));
        usuario.setActivo(true);
        usuario.setRolSistema(dto.rolSistema());

        if (dto.rolSistema() == RolSistema.EMPLEADO) {

            if (dto.sucursalId() == null) {
                throw new RuntimeException("Debe asignar una sucursal al empleado");
            }

            SucursalEmpresa sucursal = sucursalEmpresaRepository.findById(dto.sucursalId())
                    .orElseThrow(() -> new RuntimeException("Sucursal no encontrada"));

            usuario.setSucursal(sucursal);
        } else {
            usuario.setSucursal(null);
        }

        usuarioRepository.save(usuario);

        if (dto.rolSistema() == RolSistema.CLIENTE) {

            if (dto.domicilio() == null) {
                throw new RuntimeException("El cliente debe tener un domicilio");
            }

            Cliente cliente = new Cliente();
            cliente.setUsuario(usuario);
            cliente.setNombre(dto.nombre());
            cliente.setApellido(dto.apellido());
            cliente.setEmail(dto.email());
            cliente.setTelefono(dto.telefono());

            var d = dto.domicilio();
            Domicilio domicilio = new Domicilio();
            domicilio.setCalle(d.calle());
            domicilio.setNumero(d.numero());
            domicilio.setCodigoPostal(d.codigoPostal());

            Localidad localidad = localidadRepository.findById(d.localidadId())
                    .orElseThrow(() -> new RuntimeException("Localidad no encontrada"));

            domicilio.setLocalidad(localidad);
            cliente.setDomicilio(domicilio);

            clienteRepository.save(cliente);
        }

        else if (dto.rolSistema() == RolSistema.EMPLEADO) {

            Empleado empleado = new Empleado();
            empleado.setUsuario(usuario);
            empleado.setNombre(dto.nombre());
            empleado.setApellido(dto.apellido());
            empleado.setEmail(dto.email());
            empleado.setTelefono(dto.telefono());

            empleado.setPerfilEmpleado(
                    dto.perfilEmpleado() != null
                            ? dto.perfilEmpleado()
                            : PerfilEmpleado.CAJERO
            );

            empleadoRepository.save(empleado);
        }

        Usuario creado = usuarioRepository
                .findByIdWithClienteEmpleadoAndDomicilio(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Error al recuperar usuario"));

        return mapToUserDTO(creado);
    }



    public UserDTO getUser(Long id) {
        Usuario u = usuarioRepository.findByIdWithClienteEmpleadoAndDomicilio(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return mapToUserDTO(u);
    }

    public List<UserDTO> getAllUsers() {
        List<Usuario> usuarios = usuarioRepository.findAllWithClienteEmpleadoAndDomicilio();

        return usuarios.stream()
                .map(this::mapToUserDTO)
                .toList();
    }

    public UserDTO updateUser(Long id, UserEditRequestDTO userDTO) {

        Usuario usuario = usuarioRepository.findByIdWithClienteEmpleadoAndDomicilio(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setUsername(userDTO.username());
        usuario.setActivo(true);

        if(userDTO.password() != null){
            usuario.setPassword(userDTO.password());
        }

        Cliente cliente = usuario.getCliente();
        Empleado empleado = usuario.getEmpleado();

        if (cliente != null) {
            cliente.setNombre(userDTO.nombre());
            cliente.setApellido(userDTO.apellido());
            cliente.setTelefono(userDTO.telefono());
            cliente.setEmail(userDTO.email());

            UserRequestDTO.DomicilioDTO dom = userDTO.domicilio();
            if (dom != null) {

                if (cliente.getDomicilio() == null) {
                    cliente.setDomicilio(new Domicilio());
                }

                Domicilio domicilio = cliente.getDomicilio();
                domicilio.setCalle(dom.calle());
                domicilio.setCodigoPostal(dom.codigoPostal());
                domicilio.setNumero(dom.numero());

                if (dom.localidadId() != null) {
                    Localidad localidad = localidadRepository.findById(dom.localidadId())
                            .orElseThrow(() -> new RuntimeException("Localidad no encontrada"));

                    domicilio.setLocalidad(localidad);
                }
            }
        }

        if (empleado != null) {
            empleado.setNombre(userDTO.nombre());
            empleado.setApellido(userDTO.apellido());
            empleado.setTelefono(userDTO.telefono());
            empleado.setEmail(userDTO.email());
        }

        if (userDTO.sucursalId() != null) {
            SucursalEmpresa sucursal = sucursalEmpresaRepository.findById(userDTO.sucursalId())
                    .orElseThrow(() -> new RuntimeException("Sucursal no encontrada"));

            usuario.setSucursal(sucursal);
        }

        usuarioRepository.save(usuario);

        return mapToUserDTO(usuario);
    }

    public UserDTO deleteUser(Long id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setActivo(false);

        usuarioRepository.save(usuario);

        return mapToUserDTO(usuario);
    }

    private UserDTO mapToUserDTO(Usuario u) {

        Cliente cliente = u.getCliente();
        Empleado empleado = u.getEmpleado();

        String nombre = null;
        String apellido = null;
        String email = null;
        String telefono = null;
        UserDTO.Domicilio domicilioDTO = null;

        if (cliente != null) {
            nombre = cliente.getNombre();
            apellido = cliente.getApellido();
            email = cliente.getEmail();
            telefono = cliente.getTelefono();

            var domicilio = cliente.getDomicilio();
            if (domicilio != null) {
                var localidad = domicilio.getLocalidad();

                domicilioDTO = new UserDTO.Domicilio(
                        domicilio.getCalle(),
                        domicilio.getCodigoPostal(),
                        domicilio.getNumero(),
                        localidad != null
                                ? new LocalidadDTO(localidad.getId(), localidad.getNombre())
                                : null
                );
            }
        }

        if (empleado != null) {
            nombre = empleado.getNombre();
            apellido = empleado.getApellido();
            email = empleado.getEmail();
            telefono = empleado.getTelefono();
        }

        return new UserDTO(
                u.getId(),
                u.getUsername(),
                email,
                nombre,
                apellido,
                telefono,
                domicilioDTO,
                u.getRolSistema(),
                u.getActivo(),
                u.getSucursal() != null ? u.getSucursal().getId() : null
        );
    }

}
