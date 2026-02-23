package com.utn.elbuensabor.controllers;

import com.utn.elbuensabor.config.UploadStoragePaths;
import com.utn.elbuensabor.entities.ArticuloInsumo;
import com.utn.elbuensabor.entities.ImagenInsumo;
import com.utn.elbuensabor.repositories.ArticuloInsumoRepository;
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
@RequestMapping("/api/insumos")
@RequiredArgsConstructor
public class ImagenInsumoController {
    private final ArticuloInsumoRepository insumoRepository;
    private final UploadStoragePaths uploadStoragePaths;

    @PostMapping("/{id}/imagenes")
    public ResponseEntity<List<String>> uploadImagenes(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files
    ) throws IOException {

        ArticuloInsumo insumo = insumoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));

        List<String> urls = new ArrayList<>();
        Path uploadPath = uploadStoragePaths.subPath("insumos");

        Files.createDirectories(uploadPath);

        for (MultipartFile file : files) {
            String originalName = file.getOriginalFilename() == null ? "imagen" : file.getOriginalFilename();
            String filename = UUID.randomUUID() + "_" + originalName;
            Path path = uploadPath.resolve(filename);

            Files.write(path, file.getBytes());

            ImagenInsumo imagen = new ImagenInsumo();
            imagen.setDenominacion("/uploads/insumos/" + filename);
            imagen.setArticuloInsumo(insumo);

            insumo.getImagenes().add(imagen);
            urls.add(imagen.getDenominacion());
        }

        insumoRepository.save(insumo);

        return ResponseEntity.ok(urls);
    }

}
