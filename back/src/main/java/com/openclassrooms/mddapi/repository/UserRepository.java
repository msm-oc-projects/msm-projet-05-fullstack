package com.openclassrooms.mddapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openclassrooms.mddapi.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
