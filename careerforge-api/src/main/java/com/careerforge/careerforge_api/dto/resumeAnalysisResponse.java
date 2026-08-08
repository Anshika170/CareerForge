package com.careerforge.careerforge_api.dto;

import java.util.List;

public class resumeAnalysisResponse {

    private int atsScore;
    private String summary;
    private List<String> strengths;
    private List<String> missingSkills;
    private List<String> suggestions;
    private List<String> jobRoles;

    public resumeAnalysisResponse() {
    }

    public int getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(int atsScore) {
        this.atsScore = atsScore;
    }
    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public List<String> getJobRoles() {
        return jobRoles;
    }

    public void setJobRoles(List<String> jobRoles) {
        this.jobRoles = jobRoles;
    }
}