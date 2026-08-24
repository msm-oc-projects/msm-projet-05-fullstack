package com.openclassrooms.mddapi.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.openclassrooms.mddapi.dto.ProfileDtos.ProfileResponse;
import com.openclassrooms.mddapi.dto.ProfileDtos.UpdateProfileRequest;
import com.openclassrooms.mddapi.dto.TopicResponse;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.UserRepository;

@Service
/** Manages profile data while keeping password hashing server-side. */
public class ProfileService {
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserRepository userRepository, SubscriptionRepository subscriptionRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    /** Loads the profile and its ordered subscriptions. */
    public ProfileResponse get(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
        var subscriptions = subscriptionRepository.findByUserIdOrderByTopicNameAsc(userId).stream()
                .map(subscription -> TopicResponse.from(subscription.getTopic(), true))
                .toList();
        return new ProfileResponse(user.getId(), user.getEmail(), user.getUsername(), subscriptions);
    }

    @Transactional
    /** Updates profile fields and hashes a new password when supplied. */
    public ProfileResponse update(Long userId, UpdateProfileRequest request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
        userRepository.findByEmailIgnoreCase(request.email().trim())
                .filter(other -> !other.getId().equals(userId))
                .ifPresent(other -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail déjà utilisé"); });
        userRepository.findByUsernameIgnoreCase(request.username().trim())
                .filter(other -> !other.getId().equals(userId))
                .ifPresent(other -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Nom d'utilisateur déjà utilisé"); });
        user.setEmail(request.email().trim().toLowerCase());
        user.setUsername(request.username().trim());
        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
        }
        userRepository.save(user);
        return get(userId);
    }
}
