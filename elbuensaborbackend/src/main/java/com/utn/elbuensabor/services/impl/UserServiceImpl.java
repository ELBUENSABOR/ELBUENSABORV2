package com.utn.elbuensabor.services.impl;

import com.utn.elbuensabor.dtos.LocalidadDTO;
import com.utn.elbuensabor.dtos.UserDTO;
import com.utn.elbuensabor.dtos.UserEditRequestDTO;
import com.utn.elbuensabor.dtos.UserRequestDTO;
import com.utn.elbuensabor.entities.*;
import com.utn.elbuensabor.repositories.*;
import com.utn.elbuensabor.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

        // Validación de email duplicado
        if (empleadoRepository.existsByEmail(dto.email())) {

            throw new IllegalArgumentException("Ya existe un empleado registrado con ese email");
        }

        if (clienteRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Ya existe un cliente registrado con ese email");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(dto.username());
        usuario.setPassword(encoder.encode(dto.password()));
        usuario.setActivo(true);
        usuario.setRolSistema(dto.rolSistema());
        usuario.setFotoPerfil(dto.fotoPerfil());

        // si es EMPLEADO → debe cambiar la contraseña en el primer login
        if (dto.rolSistema() == RolSistema.EMPLEADO) {
            usuario.setMustChangePassword(true);
        }

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

        else if (dto.rolSistema() == RolSistema.EMPLEADO || dto.rolSistema() == RolSistema.ADMIN) {
            Empleado empleado = new Empleado();
            empleado.setUsuario(usuario);
            empleado.setNombre(dto.nombre());
            empleado.setApellido(dto.apellido());
            empleado.setEmail(dto.email());
            empleado.setTelefono(dto.telefono());

            if (dto.rolSistema() == RolSistema.ADMIN) {
                empleado.setPerfilEmpleado(PerfilEmpleado.ADMINISTRADOR);
            } else {
                empleado.setPerfilEmpleado(
                        dto.perfilEmpleado() != null
                                ? dto.perfilEmpleado()
                                : PerfilEmpleado.CAJERO);
            }

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

        Cliente cliente = usuario.getCliente();
        Empleado empleado = usuario.getEmpleado();

        var existingUser = usuarioRepository.findByUsername(userDTO.username());
        if (existingUser.isPresent() && !existingUser.get().getId().equals(usuario.getId())) {
            String estado = Boolean.TRUE.equals(existingUser.get().getActivo()) ? "activo" : "inactivo";
            throw new IllegalArgumentException("Ya existe un usuario con ese username (" + estado + ")");
        }

        var existingClienteEmail = clienteRepository.findByEmail(userDTO.email());
        if (existingClienteEmail.isPresent() && (cliente == null
                || !existingClienteEmail.get().getId().equals(cliente.getId()))) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }

        var existingEmpleadoEmail = empleadoRepository.findByEmail(userDTO.email());
        if (existingEmpleadoEmail.isPresent() && (empleado == null
                || !existingEmpleadoEmail.get().getId().equals(empleado.getId()))) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }



        usuario.setUsername(userDTO.username());
        usuario.setActivo(true);
        usuario.setFotoPerfil(userDTO.fotoPerfil());

        if (userDTO.password() != null && !userDTO.password().isBlank()) {
            usuario.setPassword(encoder.encode(userDTO.password()));
        }

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
            if (userDTO.perfilEmpleado() != null) {
                empleado.setPerfilEmpleado(userDTO.perfilEmpleado());
            }
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

    public UserDTO reactivateUser(Long id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setActivo(true);

        usuarioRepository.save(usuario);

        return mapToUserDTO(usuario);
    }

    public UserDTO updateProfilePhoto(Long id, MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Debe seleccionar una imagen");
        }

        Usuario usuario = usuarioRepository.findByIdWithClienteEmpleadoAndDomicilio(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("El archivo debe ser una imagen");
        }

        try {
            byte[] bytes = file.getBytes();
            String base64 = java.util.Base64.getEncoder().encodeToString(bytes);
            usuario.setFotoPerfil("data:" + contentType + ";base64," + base64);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo procesar la imagen de perfil", e);
        }
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
        PerfilEmpleado perfilEmpleado = null;

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
                                : null);
            }
        }

        if (empleado != null) {
            nombre = empleado.getNombre();
            apellido = empleado.getApellido();
            email = empleado.getEmail();
            telefono = empleado.getTelefono();
            perfilEmpleado = empleado.getPerfilEmpleado();
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
                u.getSucursal() != null ? u.getSucursal().getId() : null,
                perfilEmpleado,
                u.getFotoPerfil(),
                u.getFechaRegistro());
    }

}
