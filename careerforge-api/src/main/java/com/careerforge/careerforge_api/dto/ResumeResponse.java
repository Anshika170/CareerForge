package com.careerforge.careerforge_api.dto;

import java.time.LocalDateTime;

public class ResumeResponse {

    private Long id;
    private String fileName;
    private String fileType;
    private LocalDateTime uploadedAt;

    public ResumeResponse() {
    }

    public ResumeResponse(Long id, String fileName, String fileType, LocalDateTime uploadedAt) {
        this.id = id;
        this.fileName = fileName;
        this.fileType = fileType;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}