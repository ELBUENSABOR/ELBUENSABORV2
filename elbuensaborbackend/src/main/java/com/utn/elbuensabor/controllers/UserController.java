package com.utn.elbuensabor.controllers;

import com.utn.elbuensabor.dtos.UserEditRequestDTO;
import com.utn.elbuensabor.dtos.UserRequestDTO;
import jakarta.validation.Valid;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.utn.elbuensabor.dtos.UserDTO;
import com.utn.elbuensabor.services.UserService;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody @Valid UserRequestDTO dto) {
            UserDTO result = userService.createUser(dto);
            return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @PutMapping("/{id}")
    public  ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody @Valid UserEditRequestDTO user) {
            UserDTO result = userService.updateUser(id, user);
            return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserDTO> deleteUser(@PathVariable Long id){
        UserDTO dto = userService.deleteUser(id);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/reactivar")
    public ResponseEntity<UserDTO> reactivateUser(@PathVariable Long id){
        UserDTO dto = userService.reactivateUser(id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{id}/foto-perfil")
    public ResponseEntity<UserDTO> uploadProfilePhoto(@PathVariable Long id,
                                                      @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(userService.updateProfilePhoto(id, file));
    }
}
