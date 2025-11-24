package com.utn.elbuensabor.controllers;

import jakarta.validation.Valid;
import org.apache.catalina.User;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.utn.elbuensabor.dtos.UserDTO;
import com.utn.elbuensabor.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @PutMapping("/{id}")
    public  ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody @Valid UserDTO user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }
}
