package com.careerforge.careerforge_api.repository;

import com.careerforge.careerforge_api.Entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByUserId(Long userId);

    Optional<Resume> findByIdAndUserId(Long id, Long userId);

}