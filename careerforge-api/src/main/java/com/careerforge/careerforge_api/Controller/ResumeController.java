package com.careerforge.careerforge_api.Controller;

import com.careerforge.careerforge_api.dto.ResumeResponse;
import com.careerforge.careerforge_api.service.ResumeService;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    public String uploadResume(@RequestParam("file") MultipartFile file) throws IOException {

        resumeService.uploadResume(file);

        return "Resume uploaded successfully!";
    }

    @GetMapping("/my")
    public List<ResumeResponse> getMyResumes() {
        return resumeService.getMyResumes();
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long id)
            throws IOException {

        Resource resource = resumeService.downloadResume(id);
        return ResponseEntity.ok()
            .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + resource.getFilename() + "\"")
            .contentLength(resource.contentLength())
            .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResume(@PathVariable Long id) throws IOException {

        resumeService.deleteResume(id);

        return ResponseEntity.ok("Resume deleted successfully!");
    }
}