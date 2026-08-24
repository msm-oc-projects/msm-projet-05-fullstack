package com.openclassrooms.mddapi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.AuthDtos.AuthResponse;
import com.openclassrooms.mddapi.dto.AuthDtos.LoginRequest;
import com.openclassrooms.mddapi.dto.AuthDtos.RegisterRequest;
import com.openclassrooms.mddapi.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
/** Exposes the public registration and authentication endpoints. */
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    /** Registers a user and returns the initial access token. */
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    /** Authenticates by e-mail or username. */
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
