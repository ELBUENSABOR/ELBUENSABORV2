package com.utn.elbuensabor.controllers;


import com.utn.elbuensabor.config.UploadStoragePaths;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/manufacturados")
@RequiredArgsConstructor
public class ImagenManufacturadoController {
    private final ArticuloManufacturadoRepository manufacturadoRepo;
    private final UploadStoragePaths uploadStoragePaths;

    @PostMapping("/{id}/imagenes")
    public ResponseEntity<List<String>> uploadImagenes(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files
    ) throws IOException {

        ArticuloManufacturado manufacturado = manufacturadoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        List<String> urls = new ArrayList<>();
        Path uploadPath = uploadStoragePaths.subPath("manufacturados");

        Files.createDirectories(uploadPath);

        for (MultipartFile file : files) {
            String originalName = file.getOriginalFilename() == null ? "imagen" : file.getOriginalFilename();
            String filename = UUID.randomUUID() + "_" + originalName;
            Path path = uploadPath.resolve(filename);

            Files.write(path, file.getBytes());

            ImagenArticuloManufacturado imagen = new ImagenArticuloManufacturado();
            imagen.setDenominacion("/uploads/manufacturados/" + filename);
            imagen.setArticuloManufacturado(manufacturado);

            manufacturado.getImagenes().add(imagen);
            urls.add(imagen.getDenominacion());
        }

        manufacturadoRepo.save(manufacturado);

        return ResponseEntity.ok(urls);
    }
}
