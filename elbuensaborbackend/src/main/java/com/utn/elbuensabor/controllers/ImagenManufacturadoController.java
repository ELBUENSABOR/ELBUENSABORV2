package com.utn.elbuensabor.controllers;


import com.utn.elbuensabor.config.UploadStoragePaths;
import com.utn.elbuensabor.entities.ArticuloManufacturado;
import com.utn.elbuensabor.entities.ImagenArticuloManufacturado;
import com.utn.elbuensabor.repositories.ArticuloManufacturadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/manufacturados")
@RequiredArgsConstructor
public class ImagenManufacturadoController {
    private final ArticuloManufacturadoRepository manufacturadoRepo;

    @Value("${app.upload-dir:uploads}")
    private String uploadRootDir;

    private static final String UPLOAD_SUBDIR = "manufacturados";

    @PostMapping("/{id}/imagenes")
    public ResponseEntity<List<String>> uploadImagenes(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files
    ) throws IOException {

        ArticuloManufacturado manufacturado = manufacturadoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        List<String> urls = new ArrayList<>();
        Path uploadPath = uploadStoragePaths.subPath("manufacturados");

        Path uploadDir = Paths.get(uploadRootDir, UPLOAD_SUBDIR);
        Files.createDirectories(uploadDir);

        for (MultipartFile file : files) {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = uploadDir.resolve(filename);

            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            ImagenArticuloManufacturado imagen = new ImagenArticuloManufacturado();
            imagen.setDenominacion("/uploads/" + UPLOAD_SUBDIR + "/" + filename);
            imagen.setArticuloManufacturado(manufacturado);

            manufacturado.getImagenes().add(imagen);
            urls.add(imagen.getDenominacion());
        }

        manufacturadoRepo.save(manufacturado);

        return ResponseEntity.ok(urls);
    }
}
