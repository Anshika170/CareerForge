package com.careerforge.careerforge_api.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.careerforge.careerforge_api.Entity.Resume;
import com.careerforge.careerforge_api.Entity.User;
import com.careerforge.careerforge_api.repository.ResumeRepository;
import com.careerforge.careerforge_api.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.careerforge.careerforge_api.dto.resumeAnalysisResponse;

@Service
public class AIService {
    

   @Value("${gemini.api.url}")
    private String apiUrl;

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

   public resumeAnalysisResponse analyzeResume(Long resumeId) {

      System.out.println("🔥 AI SERVICE REACHED");

    Authentication authentication =
        SecurityContextHolder.getContext().getAuthentication();

    System.out.println("🔥 AUTH: " + authentication.getName());

    String email = authentication.getName();

    System.out.println("🔥 FINDING USER: " + email);

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    System.out.println("🔥 USER FOUND: " + user.getId());

    System.out.println("🔥 FINDING RESUME: " + resumeId);

    Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
            .orElseThrow(() -> new RuntimeException("Resume not found"));

    System.out.println("🔥 RESUME FOUND");

    String resumeText = resume.getExtractedText();

    System.out.println("🔥 RESUME TEXT LENGTH: " +
            (resumeText == null ? 0 : resumeText.length()));

    String prompt = """
            Analyze the following resume for ATS compatibility.

        Return ONLY valid JSON in exactly this format:

        {
        "atsScore": 0,
        "summary": "",
        "strengths": [],
        "missingSkills": [],
        "suggestions": [],
        "jobRoles": []
        }

        Rules:
        - atsScore must be an integer between 0 and 100.
        - summary should contain 2-3 professional sentences summarizing the candidate's profile.
        - strengths must contain 4-6 strengths.
        - missingSkills must contain important missing technical skills.
        - suggestions must contain practical resume improvement suggestions.
        - jobRoles must contain 3-5 suitable job roles.
        - Return ONLY JSON.
        - Do not use markdown.
        - Do not wrap the response in ```json.
        - Do not add explanations outside the JSON.

        Resume:""" + resumeText;

    Map<String, Object> body = Map.of(
            "contents", List.of(
                    Map.of(
                            "parts", List.of(
                                    Map.of("text", prompt)
                            )
                    )
            )
    );

    System.out.println("🔥 CALLING GEMINI...");

    String response;

    try {

        response = restClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .body(body)
                .retrieve()
                .body(String.class);

        System.out.println("🔥 GEMINI RAW RESPONSE:");
        System.out.println(response);

    } catch (Exception e) {

        System.out.println("❌ GEMINI API ERROR:");
        e.printStackTrace();

        throw new RuntimeException("Gemini API call failed", e);
    }

    try {

        ObjectMapper mapper = new ObjectMapper();

        JsonNode root = mapper.readTree(response);

        JsonNode candidates = root.path("candidates");

        if (candidates.isEmpty()) {
            throw new RuntimeException(
                    "Gemini returned no candidates: " + response
            );
        }

        String analysis = candidates
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();

        System.out.println("🔥 GEMINI ANALYSIS:");
        System.out.println(analysis);

        return mapper.readValue(
                analysis,
                resumeAnalysisResponse.class
        );

    } catch (Exception e) {

        System.out.println("❌ JSON PARSING ERROR:");
        e.printStackTrace();

        throw new RuntimeException(
                "Failed to parse Gemini response",
                e
        );
    }
}
}
