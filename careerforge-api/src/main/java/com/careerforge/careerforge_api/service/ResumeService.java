package com.careerforge.careerforge_api.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.careerforge.careerforge_api.Entity.Resume;
import com.careerforge.careerforge_api.Entity.User;
import com.careerforge.careerforge_api.dto.ResumeResponse;
import com.careerforge.careerforge_api.repository.ResumeRepository;
import com.careerforge.careerforge_api.repository.UserRepository;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final pdfService pdfService;

    public ResumeService(ResumeRepository resumeRepository, UserRepository userRepository, pdfService pdfService) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.pdfService = pdfService;
    }


    public void uploadResume(MultipartFile file) throws IOException {

    // 1. Get logged-in user from JWT
    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    System.out.println("🔥 UPLOAD USER EMAIL: " + email);

    // 2. Find user from database
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    System.out.println("🔥 UPLOAD USER ID: " + user.getId());

    // 3. Get original file name
    String originalFileName = file.getOriginalFilename();

    // 4. Generate unique file name
    String uniqueFileName =
            UUID.randomUUID() + "_" + originalFileName;

    // 5. Save file
    Path uploadPath = Paths.get("uploads");

    if (!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
    }

    Path filePath = uploadPath.resolve(uniqueFileName);

    Files.copy(
            file.getInputStream(),
            filePath,
            StandardCopyOption.REPLACE_EXISTING
    );

    // 6. Extract text
    String extractedText = pdfService.extractText(filePath);

    // 7. Create Resume entity
    Resume resume = new Resume();

    resume.setFileName(originalFileName);
    resume.setFilePath(filePath.toString());
    resume.setFileType(file.getContentType());
    resume.setExtractedText(extractedText);
    resume.setUser(user);   // ⭐ THIS IS THE IMPORTANT LINE

    // 8. Save resume
    resumeRepository.save(resume);

    System.out.println("🔥 RESUME SAVED: " + resume.getId());
    System.out.println("🔥 RESUME USER ID: " + user.getId());
}
    public List<ResumeResponse> getMyResumes() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Resume> resumes = resumeRepository.findByUserId(user.getId());

        return resumes.stream()
                .map(resume -> new ResumeResponse(
                        resume.getId(),
                        resume.getFileName(),
                        resume.getFileType(),
                        resume.getUploadedAt()))
                .toList();
    }


    public Resource downloadResume(Long resumeId) throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        Path path = Paths.get(resume.getFilePath());

        System.out.println("Path: " + path.toAbsolutePath());

        Resource resource = new UrlResource(path.toUri());

        System.out.println("Exists: " + resource.exists());
        System.out.println("Readable: " + resource.isReadable());

        return resource;
    }

    public void deleteResume(Long resumeId) throws IOException {

        Authentication authentication =
        SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
        .orElseThrow(() -> new RuntimeException("Resume not found"));

        Path path = Paths.get(resume.getFilePath());

        Files.deleteIfExists(path);

        resumeRepository.delete(resume);

    }

}