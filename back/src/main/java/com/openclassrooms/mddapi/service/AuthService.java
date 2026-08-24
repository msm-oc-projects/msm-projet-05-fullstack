package com.openclassrooms.mddapi.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.openclassrooms.mddapi.dto.AuthDtos.AuthResponse;
import com.openclassrooms.mddapi.dto.AuthDtos.LoginRequest;
import com.openclassrooms.mddapi.dto.AuthDtos.RegisterRequest;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.UserRepository;

@Service
/** Applies registration and authentication rules before issuing JWTs. */
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final long expirationSeconds;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtEncoder jwtEncoder,
            @Value("${app.jwt.expiration}") long expirationSeconds) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
        this.expirationSeconds = expirationSeconds;
    }

    @Transactional
    /** Creates a user after checking uniqueness and password policy validation. */
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        String username = request.username().trim();
        if (userRepository.existsByEmailIgnoreCase(email) || userRepository.existsByUsernameIgnoreCase(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail ou nom d'utilisateur déjà utilisé");
        }
        var user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        return response(userRepository.save(user));
    }

    /** Verifies credentials and creates a short-lived signed access token. */
    public AuthResponse login(LoginRequest request) {
        var user = userRepository.findByEmailIgnoreCase(request.identifier().trim())
                .or(() -> userRepository.findByUsernameIgnoreCase(request.identifier().trim()))
                .filter(candidate -> passwordEncoder.matches(request.password(), candidate.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides"));
        return response(user);
    }

    private AuthResponse response(User user) {
        Instant issuedAt = Instant.now();
        var claims = JwtClaimsSet.builder()
                .issuer("mdd-api")
                .issuedAt(issuedAt)
                .expiresAt(issuedAt.plus(expirationSeconds, ChronoUnit.SECONDS))
                .subject(user.getId().toString())
                .claim("username", user.getUsername())
                .build();
        var header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getUsername());
    }
}
