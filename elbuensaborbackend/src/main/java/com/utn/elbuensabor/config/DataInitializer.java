package com.utn.elbuensabor.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.utn.elbuensabor.entities.Cliente;
import com.utn.elbuensabor.entities.Domicilio;
import com.utn.elbuensabor.entities.Localidad;
import com.utn.elbuensabor.entities.RolSistema;
import com.utn.elbuensabor.entities.Usuario;
import com.utn.elbuensabor.repositories.ClienteRepository;
import com.utn.elbuensabor.repositories.LocalidadRepository;
import com.utn.elbuensabor.repositories.PaisRepository;
import com.utn.elbuensabor.repositories.ProvinciaRepository;
import com.utn.elbuensabor.repositories.UsuarioRepository;

@Configuration
public class DataInitializer {

    @Bean
    @SuppressWarnings("unused")
    CommandLineRunner initAdmin(
            UsuarioRepository usuarioRepo,
            ClienteRepository clienteRepo,
            PaisRepository paisRepo,
            ProvinciaRepository provinciaRepo,
            LocalidadRepository localidadRepo,
            PasswordEncoder encoder
    ) {
        return args -> {
            // Revisar si ya existe el admin
            if (!usuarioRepo.existsByUsername("admin")) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword(encoder.encode("admin123")); // Cambiar contraseña por defecto
                admin.setRolSistema(RolSistema.ADMIN);
                admin.setActivo(true);

                Cliente cliente = new Cliente();
                cliente.setNombre("Admin");
                cliente.setApellido("Admin");
                cliente.setEmail("admin@admin.com");
                cliente.setTelefono("1234567890");
                cliente.setUsuario(admin);

                provinciaRepo.findByNombre("Mendoza")
                        .orElseThrow(() -> new RuntimeException("Provincia no encontrada"));

                paisRepo.findByNombre("Argentina")
                        .orElseThrow(() -> new RuntimeException("País no encontrado"));

                Localidad loc = localidadRepo.findById((long) 17)
                        .orElseThrow(() -> new RuntimeException("Localidad no encontrada"));

                Domicilio d = new Domicilio();
                d.setCalle("Calle 123");
                d.setCodigoPostal(1234);
                d.setNumero("1234");
                d.setLocalidad(loc);

                cliente.setDomicilio(d);

                usuarioRepo.save(admin);
                clienteRepo.save(cliente);

                System.out.println("Usuario ADMIN creado: admin / admin123");
            }
        };
    }
}
