package com.utn.elbuensabor.services.impl;

import com.utn.elbuensabor.dtos.*;
import com.utn.elbuensabor.entities.*;
import com.utn.elbuensabor.repositories.*;
import com.utn.elbuensabor.security.JwtUtil;
import com.utn.elbuensabor.services.AuthService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepo;
    private final ClienteRepository clienteRepo;
    private final EmpleadoRepository empleadoRepo;
    private final PaisRepository paisRepo;
    private final ProvinciaRepository provinciaRepo;
    private final LocalidadRepository localidadRepo;

    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwt;

    @Value("${google.oauth.client-id:}")
    private String googleClientId;

    @Value("${google.oauth.issuer:https://accounts.google.com}")
    private String googleIssuer;

    @Transactional
    public AuthResponse register(RegisterRequest req) {

        if (usuarioRepo.existsByUsername(req.username())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese username");
        }

        if (clienteRepo.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Ya existe un cliente con ese email");
        }

        if (empleadoRepo.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Ya existe un empleado con ese email");
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

        return new AuthResponse(
                token,
                u.getUsername(),
                "CLIENTE",
                null,
                u.getId().toString(),
                Boolean.TRUE.equals(u.getMustChangePassword()),
                null,
                u.getFotoPerfil()); // Los clientes no tienen sucursal asignada
    }

    public AuthResponse login(LoginRequest req) {
        String identifier = req.username();
        String username = usuarioRepo.findByUsername(identifier)
                .map(Usuario::getUsername)
                .orElseGet(() -> clienteRepo.findByEmail(identifier)
                        .map(cliente -> cliente.getUsuario().getUsername())
                        .orElseGet(() -> empleadoRepo.findByEmail(identifier)
                                .map(empleado -> empleado.getUsuario().getUsername())
                                .orElse(null)));

        if (username == null) {
            throw new IllegalArgumentException("Usuario/Email o contraseña incorrectos");
        }

        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, req.password()));
        } catch (AuthenticationException ex) {
            throw new IllegalArgumentException("Usuario/Email o contraseña incorrectos");
        }

        Usuario u = usuarioRepo.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuario/Email o contraseña incorrectos"));

        if (Boolean.FALSE.equals(u.getActivo())) {
            throw new IllegalArgumentException("El usuario se encuentra dado de baja");
        }

        String token = jwt.generateToken(u.getUsername());

        String sucursalId = (u.getSucursal() != null)
                ? u.getSucursal().getId().toString()
                : null;

        return new AuthResponse(
                token,
                u.getUsername(),
                u.getRolSistema().name(),
                u.getRolSistema() == RolSistema.EMPLEADO ? u.getEmpleado().getPerfilEmpleado().toString() : null,
                u.getId().toString(),
                Boolean.TRUE.equals(u.getMustChangePassword()),
                sucursalId,
                u.getFotoPerfil()); // Usar la variable ya calculada que maneja el null
    }

    public AuthResponse loginWithGoogle(GoogleAuthRequest req) {
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new IllegalArgumentException("Google Client ID no configurado");
        }

        Jwt jwtToken = verifyGoogleToken(req.credential());

        if (jwtToken == null) {
            throw new IllegalArgumentException("Token de Google inválido");
        }

        String email = jwtToken.getClaimAsString("email");
        Boolean emailVerified = jwtToken.getClaim("email_verified");
        String picture = jwtToken.getClaimAsString("picture");

        if (!Boolean.TRUE.equals(emailVerified)) {
            throw new IllegalArgumentException("El email de Google no está verificado");
        }

        String subject = jwtToken.getSubject();
        String auth0Id = "google:" + subject;

        Usuario u = usuarioRepo.findByAuth0Id(auth0Id).orElse(null);

        if (u == null) {
            u = clienteRepo.findByEmail(email)
                    .map(Cliente::getUsuario)
                    .orElseGet(() -> empleadoRepo.findByEmail(email)
                            .map(empleado -> empleado.getUsuario())
                            .orElse(null));
        }

        if (u == null) {
            u = createGoogleCliente(jwtToken, auth0Id);
        } else if (u.getAuth0Id() == null || u.getAuth0Id().isBlank()) {
            u.setAuth0Id(auth0Id);
            if (u.getFotoPerfil() == null || u.getFotoPerfil().isBlank()) {
                u.setFotoPerfil(picture);
            }
            usuarioRepo.save(u);
        }

        if (Boolean.FALSE.equals(u.getActivo())) {
            throw new IllegalArgumentException("El usuario se encuentra dado de baja");
        }

        String token = jwt.generateToken(u.getUsername());
        String sucursalId = (u.getSucursal() != null)
                ? u.getSucursal().getId().toString()
                : null;

        return new AuthResponse(
                token,
                u.getUsername(),
                u.getRolSistema().name(),
                u.getRolSistema() == RolSistema.EMPLEADO ? u.getEmpleado().getPerfilEmpleado().toString() : null,
                u.getId().toString(),
                Boolean.TRUE.equals(u.getMustChangePassword()),
                sucursalId,
                u.getFotoPerfil());
    }

    public void changePassword(String username, ChangePasswordRequest req) {

        Usuario u = usuarioRepo.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (!encoder.matches(req.oldPassword(), u.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual no es correcta");
        }

        if (!req.newPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,}$")) {
            throw new IllegalArgumentException(
                    "La nueva contraseña no cumple con los requisitos de seguridad");
        }

        u.setPassword(encoder.encode(req.newPassword()));
        u.setMustChangePassword(false); // ya no necesita cambiarla

        usuarioRepo.save(u);
    }

    private Jwt verifyGoogleToken(String credential) {
        try {
            JwtDecoder decoder = buildGoogleJwtDecoder();
            return decoder.decode(credential);
        } catch (Exception ex) {
            return null;
        }
    }

    private JwtDecoder buildGoogleJwtDecoder() {
        NimbusJwtDecoder decoder = JwtDecoders.fromIssuerLocation(googleIssuer);
        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(googleIssuer);
        OAuth2TokenValidator<Jwt> withAudience = jwt -> {
            List<String> audience = jwt.getAudience();
            if (audience != null && audience.contains(googleClientId)) {
                return OAuth2TokenValidatorResult.success();
            }
            return OAuth2TokenValidatorResult.failure(
                    new OAuth2Error("invalid_token", "El token no pertenece a este cliente", null));
        };
        decoder.setJwtValidator(token -> {
            OAuth2TokenValidatorResult issuerResult = withIssuer.validate(token);
            if (issuerResult.hasErrors()) {
                return issuerResult;
            }
            OAuth2TokenValidatorResult audienceResult = withAudience.validate(token);
            if (audienceResult.hasErrors()) {
                return audienceResult;
            }
            return OAuth2TokenValidatorResult.success();
        });
        return decoder;
    }

    private Usuario createGoogleCliente(Jwt jwtToken, String auth0Id) {
        String email = jwtToken.getClaimAsString("email");
        String givenName = jwtToken.getClaimAsString("given_name");
        String familyName = jwtToken.getClaimAsString("family_name");
        String username = generateUniqueUsername(email);
        String picture = jwtToken.getClaimAsString("picture");

        Usuario u = new Usuario();
        u.setUsername(username);
        u.setPassword(encoder.encode(UUID.randomUUID().toString()));
        u.setRolSistema(RolSistema.CLIENTE);
        u.setActivo(true);
        u.setAuth0Id(auth0Id);
        u.setFotoPerfil(picture);

        Cliente c = new Cliente();
        String safeGivenName = givenName == null ? "" : givenName;
        String safeFamilyName = familyName == null ? "" : familyName;
        c.setNombre(safeGivenName.isBlank() ? "Google" : safeGivenName);
        c.setApellido(safeFamilyName.isBlank() ? "User" : safeFamilyName);
        c.setEmail(email);
        c.setUsuario(u);

        usuarioRepo.save(u);
        clienteRepo.save(c);

        return u;
    }

    private String generateUniqueUsername(String email) {
        String base = email.split("@")[0].replaceAll("[^a-zA-Z0-9._-]", "");
        if (base.isBlank()) {
            base = "googleuser";
        }

        String candidate = base;
        int counter = 1;
        while (usuarioRepo.existsByUsername(candidate)) {
            candidate = base + counter;
            counter++;
        }
        return candidate;
    }

}
