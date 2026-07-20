package com.careerforge.careerforge_api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careerforge.careerforge_api.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
