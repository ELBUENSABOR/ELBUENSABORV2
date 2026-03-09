package com.utn.elbuensabor.config;

import com.utn.elbuensabor.entities.*;
import com.utn.elbuensabor.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger LOGGER = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    @SuppressWarnings("unused")
    CommandLineRunner initAdmin(
            UsuarioRepository usuarioRepo,
            ClienteRepository clienteRepo,
            PaisRepository paisRepo,
            ProvinciaRepository provinciaRepo,
            LocalidadRepository localidadRepo,
            EmpresaRepository empresaRepository,
            PasswordEncoder encoder
    ) {
        return args -> {
            try {

            // ==============================
            // 1️⃣ Crear País Argentina
            // ==============================
            Pais argentina = paisRepo.findByNombre("Argentina")
                    .orElseGet(() -> {
                        Pais p = new Pais();
                        p.setNombre("Argentina");
                        return paisRepo.save(p); // 🔥 GUARDA PRIMERO
                    });

            // ==============================
            // 2️⃣ Crear Provincia Mendoza
            // ==============================
            Provincia mendoza = provinciaRepo.findByNombre("Mendoza")
                    .orElseGet(() -> {
                        Provincia prov = new Provincia();
                        prov.setNombre("Mendoza");
                        prov.setPais(argentina);   // usa país ya persistido
                        return provinciaRepo.save(prov);
                    });

            // ==============================
            // 3️⃣ Crear Localidades
            // ==============================
            String[] localidades = {
                    "Mendoza Capital", "Godoy Cruz", "Guaymallén",
                    "Las Heras", "Luján de Cuyo", "Maipú"
            };

            for (String nombreLoc : localidades) {
                if (!localidadRepo.existsByNombre(nombreLoc)) {
                    Localidad loc = new Localidad();
                    loc.setNombre(nombreLoc);
                    loc.setProvincia(mendoza);    // provincia ya persistida
                    localidadRepo.save(loc);
                }
            }

            // ==============================
            // 4️⃣ Empresa
            // ==============================
            if (!empresaRepository.existsByNombre("ElBuenSabor")) {
                Empresa e = new Empresa();
                e.setNombre("ElBuenSabor");
                e.setCuil(123456789);
                e.setRazonSocial("ElBuenSabor");
                empresaRepository.save(e);
            }

            // ==============================
            // 5️⃣ Usuario ADMIN
            // ==============================
            if (!usuarioRepo.existsByUsername("admin")) {

                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRolSistema(RolSistema.ADMIN);
                admin.setActivo(true);

                Cliente cliente = new Cliente();
                cliente.setNombre("Admin");
                cliente.setApellido("Admin");
                cliente.setEmail("admin@admin.com");
                cliente.setTelefono("123456789");
                cliente.setUsuario(admin);

                // Tomar una localidad existente
                Localidad loc = localidadRepo.findByNombre("Mendoza Capital")
                        .orElseThrow(() -> new RuntimeException("Localidad no encontrada"));

                Domicilio d = new Domicilio();
                d.setCalle("Calle 123");
                d.setCodigoPostal(5500);
                d.setNumero("100");
                d.setLocalidad(loc);

                cliente.setDomicilio(d);

                usuarioRepo.save(admin);
                clienteRepo.save(cliente);

                LOGGER.info("Usuario ADMIN creado: admin / admin123");
            }
            } catch (Exception ex) {
                LOGGER.error("Error inicializando datos base (se continúa sin abortar la app)", ex);
            }
        };
    }

}
