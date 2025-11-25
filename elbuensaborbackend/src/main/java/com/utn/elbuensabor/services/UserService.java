package com.utn.elbuensabor.services;

import com.utn.elbuensabor.dtos.UserRequestDTO;
import com.utn.elbuensabor.entities.*;
import com.utn.elbuensabor.repositories.*;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;

import com.utn.elbuensabor.dtos.LocalidadDTO;
import com.utn.elbuensabor.dtos.UserDTO;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UsuarioRepository usuarioRepository;
    private final LocalidadRepository localidadRepository;
    private final PasswordEncoder encoder;
    private final ClienteRepository clienteRepository;
    private final EmpleadoRepository empleadoRepository;
    private final SucursalEmpresaRepository sucursalEmpresaRepository;

    public UserDTO createUser(UserRequestDTO dto) {

        // ==========================================
        // 1) CREAR USUARIO BASE
        // ==========================================
        Usuario usuario = new Usuario();
        usuario.setUsername(dto.username());
        usuario.setPassword(encoder.encode(dto.password()));
        usuario.setActivo(true);
        usuario.setRolSistema(dto.rolSistema());

        SucursalEmpresa sucursal = sucursalEmpresaRepository.findById(dto.sucursalId())
                .orElseThrow(() -> new RuntimeException("Sucursal no encontrada"));

        usuario.setSucursal(sucursal);

        // Persisto el usuario primero para obtener ID
        usuarioRepository.save(usuario);

        // ==========================================
        // 2) SI ES CLIENTE → CREAR CLIENTE + DOMICILIO
        // ==========================================
        if (dto.rolSistema() == RolSistema.CLIENTE || dto.rolSistema() == RolSistema.ADMIN) {

            Cliente cliente = new Cliente();
            cliente.setUsuario(usuario);
            cliente.setNombre(dto.nombre());
            cliente.setApellido(dto.apellido());
            cliente.setEmail(dto.email());
            cliente.setTelefono(dto.telefono());

            // ---- DOMICILIO ----
            if (dto.domicilio() == null) {
                throw new RuntimeException("El cliente debe tener un domicilio");
            }

            var d = dto.domicilio();

            Domicilio domicilio = new Domicilio();
            domicilio.setCalle(d.calle());
            domicilio.setNumero(d.numero());
            domicilio.setCodigoPostal(d.codigoPostal());

            // Localidad obligatoria
            Localidad localidad = localidadRepository.findById(d.localidadId())
                    .orElseThrow(() -> new RuntimeException("Localidad no encontrada"));

            domicilio.setLocalidad(localidad);

            cliente.setDomicilio(domicilio);

            clienteRepository.save(cliente);
        }

        // ==========================================
        // 3) SI ES EMPLEADO → CREAR EMPLEADO
        // ==========================================
        else if (dto.rolSistema() == RolSistema.EMPLEADO) {

            Empleado empleado = new Empleado();
            empleado.setUsuario(usuario);

            empleado.setNombre(dto.nombre());
            empleado.setApellido(dto.apellido());
            empleado.setEmail(dto.email());
            empleado.setTelefono(dto.telefono());

            // PerfilEmpleado podría venir por DTO o tener uno por defecto
            empleado.setPerfilEmpleado(dto.perfilEmpleado() != null
                    ? dto.perfilEmpleado()
                    : PerfilEmpleado.CAJERO);

            empleadoRepository.save(empleado);
        }


        // ==========================================
        // 5) DEVOLVER DTO con mapper
        // ==========================================
        Usuario creado = usuarioRepository
                .findByIdWithClienteEmpleadoAndDomicilio(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Error al recuperar usuario"));

        return mapToUserDTO(creado);
    }


    // ============================================
    // GET USER
    // ============================================
    public UserDTO getUser(Long id) {
        Usuario u = usuarioRepository.findByIdWithClienteEmpleadoAndDomicilio(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return mapToUserDTO(u);
    }

    // ============================================
    // GET ALL USERS
    // ============================================
    public List<UserDTO> getAllUsers() {
        List<Usuario> usuarios = usuarioRepository.findAllWithClienteEmpleadoAndDomicilio();

        return usuarios.stream()
                .map(this::mapToUserDTO)
                .toList();
    }

    // ============================================
    // UPDATE USER (cliente OR empleado)
    // ============================================
    public UserDTO updateUser(Long id, UserRequestDTO userDTO) {

        Usuario usuario = usuarioRepository.findByIdWithClienteEmpleadoAndDomicilio(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // ----------- ACTUALIZAR DATOS BÁSICOS -----------
        usuario.setUsername(userDTO.username());
        usuario.setActivo(true);

        Cliente cliente = usuario.getCliente();
        Empleado empleado = usuario.getEmpleado();

        // ----------- SI ES CLIENTE -----------
        if (cliente != null) {
            cliente.setNombre(userDTO.nombre());
            cliente.setApellido(userDTO.apellido());
            cliente.setTelefono(userDTO.telefono());
            cliente.setEmail(userDTO.email());

            // DOMICILIO
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

        // ----------- SI ES EMPLEADO -----------
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



    // ============================================
    // MAPPER (SE USA INTERNAMENTE)
    // ============================================
    private UserDTO mapToUserDTO(Usuario u) {

        Cliente cliente = u.getCliente();
        Empleado empleado = u.getEmpleado();

        String nombre = null;
        String apellido = null;
        String email = null;
        String telefono = null;
        UserDTO.Domicilio domicilioDTO = null;

        // ----------- CLIENTE -----------
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

        // ----------- EMPLEADO -----------
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
