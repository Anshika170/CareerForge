package com.careerforge.careerforge_api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.careerforge.careerforge_api.Entity.Resume;
import com.careerforge.careerforge_api.Entity.User;
import com.careerforge.careerforge_api.repository.ResumeRepository;
import com.careerforge.careerforge_api.repository.UserRepository;

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    private final RestClient restClient;

    public AIService(
        RestClient restClient,
        ResumeRepository resumeRepository,
        UserRepository userRepository) {

    this.restClient = restClient;
    this.resumeRepository = resumeRepository;
    this.userRepository = userRepository;
}

    public String analyzeResume(Long resumeId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        return resume.getExtractedText();

    } 

}
