package com.utn.elbuensabor.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.utn.elbuensabor.entities.RolSistema;
import com.utn.elbuensabor.entities.Usuario;
import com.utn.elbuensabor.repositories.UsuarioRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdmin(
            UsuarioRepository usuarioRepo,
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

                usuarioRepo.save(admin);

                System.out.println("Usuario ADMIN creado: admin / admin123");
            }
        };
    }
}
