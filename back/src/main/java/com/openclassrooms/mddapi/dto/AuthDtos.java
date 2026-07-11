package com.openclassrooms.mddapi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {
    }

    public static final String PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$";

    public record RegisterRequest(@NotBlank @Email String email, @NotBlank @Size(max = 100) String username,
            @NotBlank @Pattern(regexp = PASSWORD_PATTERN) String password) {
    }

    public record LoginRequest(@NotBlank String identifier, @NotBlank String password) {
    }

    public record AuthResponse(String token, Long userId, String email, String username) {
    }
}
