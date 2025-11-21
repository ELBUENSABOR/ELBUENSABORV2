package com.utn.elbuensabor.dtos;

public record AuthResponse(String token, String username, String role, String userId) {
}
