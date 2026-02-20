package com.utn.elbuensabor.services;


import com.utn.elbuensabor.dtos.*;

public interface AuthService {

    AuthResponse register(RegisterRequest req);

    AuthResponse login(LoginRequest req);

    AuthResponse loginWithGoogle(GoogleAuthRequest req);

    void changePassword(String username, ChangePasswordRequest req);
}
