package com.openclassrooms.mddapi.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.config.CurrentUser;
import com.openclassrooms.mddapi.dto.ProfileDtos.ProfileResponse;
import com.openclassrooms.mddapi.dto.ProfileDtos.UpdateProfileRequest;
import com.openclassrooms.mddapi.service.ProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/me")
/** Exposes the authenticated user's profile and subscriptions. */
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    /** Returns the current user's profile. */
    public ProfileResponse get(Authentication authentication) {
        return profileService.get(CurrentUser.id(authentication));
    }

    @PutMapping
    /** Updates the current user's profile and optional password. */
    public ProfileResponse update(@Valid @RequestBody UpdateProfileRequest request, Authentication authentication) {
        return profileService.update(CurrentUser.id(authentication), request);
    }
}
