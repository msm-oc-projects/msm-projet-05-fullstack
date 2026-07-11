package com.openclassrooms.mddapi.dto;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class ProfileDtos {
    private ProfileDtos() {
    }

    public record ProfileResponse(Long id, String email, String username, List<TopicResponse> subscriptions) {
    }

    public record UpdateProfileRequest(@NotBlank @Email String email, @NotBlank @Size(max = 100) String username,
            @Pattern(regexp = AuthDtos.PASSWORD_PATTERN) String password) {
    }
}
