package com.utn.elbuensabor.services.impl;


import com.utn.elbuensabor.services.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.utn.elbuensabor.dtos.AuthResponse;
import com.utn.elbuensabor.dtos.LoginRequest;
import com.utn.elbuensabor.dtos.RegisterRequest;
import com.utn.elbuensabor.entities.Cliente;
import com.utn.elbuensabor.entities.Domicilio;
import com.utn.elbuensabor.entities.Localidad;
import com.utn.elbuensabor.entities.Pais;
import com.utn.elbuensabor.entities.Provincia;
import com.utn.elbuensabor.entities.RolSistema;
import com.utn.elbuensabor.entities.Usuario;
import com.utn.elbuensabor.repositories.ClienteRepository;
import com.utn.elbuensabor.repositories.LocalidadRepository;
import com.utn.elbuensabor.repositories.PaisRepository;
import com.utn.elbuensabor.repositories.ProvinciaRepository;
import com.utn.elbuensabor.repositories.UsuarioRepository;
import com.utn.elbuensabor.security.JwtUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepo;
    private final ClienteRepository clienteRepo;
    private final PaisRepository paisRepo;
    private final ProvinciaRepository provinciaRepo;
    private final LocalidadRepository localidadRepo;

    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwt;

    @Transactional
    public AuthResponse register(RegisterRequest req) {

        if (usuarioRepo.existsByUsername(req.username())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese username");
        }

        if (clienteRepo.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Ya existe un cliente con ese email");
        }

        Usuario u = new Usuario();
        u.setUsername(req.username());
        u.setPassword(encoder.encode(req.password()));
        u.setRolSistema(RolSistema.CLIENTE);
        u.setActivo(true);

        Cliente c = new Cliente();
        c.setNombre(req.nombre());
        c.setApellido(req.apellido());
        c.setEmail(req.email());
        c.setTelefono(req.telefono());
        c.setUsuario(u);

        Provincia pr = provinciaRepo.findByNombre("Mendoza")
                .orElseThrow(() -> new RuntimeException("Provincia no encontrada"));

        Pais p = paisRepo.findByNombre("Argentina")
                .orElseThrow(() -> new RuntimeException("País no encontrado"));

        Localidad loc = localidadRepo.findById(req.localidad())
                .orElseThrow(() -> new RuntimeException("Localidad no encontrada"));

        Domicilio d = new Domicilio();
        d.setCalle(req.calle());
        d.setCodigoPostal(req.codigoPostal());
        d.setNumero(req.numero());
        d.setLocalidad(loc);

        c.setDomicilio(d);

        usuarioRepo.save(u);
        clienteRepo.save(c);

        String token = jwt.generateToken(u.getUsername());

        return new AuthResponse(token, u.getUsername(), "CLIENTE", u.getId().toString());
    }

    public AuthResponse login(LoginRequest req) {

        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.username(), req.password())
            );
        } catch (AuthenticationException ex) {
            throw new IllegalArgumentException("Usuario o contraseña incorrectos");
        }

        Usuario u = usuarioRepo.findByUsername(req.username())
                .orElseThrow(() -> new IllegalArgumentException("Usuario o contraseña incorrectos"));

        String token = jwt.generateToken(u.getUsername());

        return new AuthResponse(token, u.getUsername(), u.getRolSistema().name(), u.getId().toString());
    }
}
