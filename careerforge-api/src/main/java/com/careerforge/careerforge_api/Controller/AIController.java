package com.careerforge.careerforge_api.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careerforge.careerforge_api.dto.resumeAnalysisResponse;
import com.careerforge.careerforge_api.service.AIService;

import com.careerforge.careerforge_api.dto.jobMatchRequest;
import com.careerforge.careerforge_api.dto.JobMatchResponse;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze/{resumeId}")
    public resumeAnalysisResponse analyzeResume(@PathVariable Long resumeId) {

    
    System.out.println("🔥 AI CONTROLLER REACHED");
    System.out.println("Resume ID: " + resumeId);

    resumeAnalysisResponse result = aiService.analyzeResume(resumeId);

    System.out.println("🔥 AI SERVICE COMPLETED");

    return result;
}

    @PostMapping("/job-match")
    public List<JobMatchResponse> matchJob(
            @RequestBody jobMatchRequest request) {

        System.out.println("🔥 JOB MATCH CONTROLLER REACHED");

        return aiService.matchJob(request.getJobDescription());
    }
}