package com.utn.elbuensabor.services;


import com.utn.elbuensabor.dtos.AuthResponse;
import com.utn.elbuensabor.dtos.ChangePasswordRequest;
import com.utn.elbuensabor.dtos.LoginRequest;
import com.utn.elbuensabor.dtos.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest req);

    AuthResponse login(LoginRequest req);

    void changePassword(String username, ChangePasswordRequest req);
}