package com.openclassrooms.mddapi.config;

import org.springframework.security.core.Authentication;

/**
 * Extracts the authenticated MDD user id from Spring Security's JWT authentication.
 */
public final class CurrentUser {
    private CurrentUser() {
    }

    public static Long id(Authentication authentication) {
        return Long.valueOf(authentication.getName());
    }
}
