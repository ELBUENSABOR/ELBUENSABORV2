package com.utn.elbuensabor.controllers;


import com.utn.elbuensabor.entities.ArticuloManufacturado;
import com.utn.elbuensabor.entities.ImagenArticuloManufacturado;
import com.utn.elbuensabor.repositories.ArticuloManufacturadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/manufacturados")
@RequiredArgsConstructor
public class ImagenManufacturadoController {
    private final ArticuloManufacturadoRepository manufacturadoRepo;

    private static final String UPLOAD_DIR = "uploads/manufacturados";

    @PostMapping("/{id}/imagenes")
    public ResponseEntity<List<String>> uploadImagenes(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files
    ) throws IOException {

        ArticuloManufacturado manufacturado = manufacturadoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        List<String> urls = new ArrayList<>();

        Files.createDirectories(Paths.get(UPLOAD_DIR));

        for (MultipartFile file : files) {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR, filename);

            Files.write(path, file.getBytes());

            ImagenArticuloManufacturado imagen = new ImagenArticuloManufacturado();
            imagen.setDenominacion("/" + UPLOAD_DIR + "/" + filename);
            imagen.setArticuloManufacturado(manufacturado);

            manufacturado.getImagenes().add(imagen);
            urls.add(imagen.getDenominacion());
        }

        manufacturadoRepo.save(manufacturado);

        return ResponseEntity.ok(urls);
    }
}