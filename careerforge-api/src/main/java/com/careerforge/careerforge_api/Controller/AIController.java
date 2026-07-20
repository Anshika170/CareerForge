package com.careerforge.careerforge_api.Controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careerforge.careerforge_api.service.AIService;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze/{resumeId}")
    public String analyzeResume(@PathVariable Long resumeId) {

        return aiService.analyzeResume(resumeId);

    }

}