import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AnalysisService } from '../../services/analysis';

interface ResumeResponse {
  id: number;
  fileName: string;
  fileType: string;
  uploadedAt: string;
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume.html',
  styleUrl: './resume.css'
})
export class Resume implements OnInit {

  selectedFile: File | null = null;
  uploading = false;
  busyAction = false;

  resumes: ResumeResponse[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private analysisService: AnalysisService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadResumes();
    }
  }

  loadResumes(): void {

    this.http.get<ResumeResponse[]>(
      'http://localhost:8080/api/resume/my'
    ).subscribe({

      next: (response) => {

        console.log('API Response:', response);

        // Create a new array reference
        this.resumes = [...response];

        console.log('this.resumes:', this.resumes);
        console.log('length:', this.resumes.length);

        // Force UI refresh
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Failed to load resumes:', error);
      }

    });
  }

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedFile = input.files[0];

    console.log('Selected file:', this.selectedFile.name);

    this.uploadResume();
  }

  uploadResume(): void {

    if (!this.selectedFile) {
      return;
    }

    this.uploading = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post(
      'http://localhost:8080/api/resume/upload',
      formData,
      {
        responseType: 'text'
      }
    ).subscribe({

      next: (response) => {

        console.log('Upload successful:', response);

        this.uploading = false;
        this.selectedFile = null;

        this.loadResumes();
      },

      error: (error) => {

        console.error('Upload failed:', error);

        this.uploading = false;
      }

    });
  }

  downloadResume(resumeId: number): void {
    this.busyAction = true;

    this.http.get(`http://localhost:8080/api/resume/download/${resumeId}`, {
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `resume-${resumeId}.pdf`;
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.busyAction = false;
      },
      error: (error) => {
        console.error('Download failed:', error);
        this.busyAction = false;
      }
    });
  }

  deleteResume(resumeId: number): void {
    this.busyAction = true;

    this.http.delete(`http://localhost:8080/api/resume/${resumeId}`).subscribe({
      next: () => {
        this.resumes = this.resumes.filter((resume) => resume.id !== resumeId);
        this.busyAction = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Delete failed:', error);
        this.busyAction = false;
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }

  goToAnalysis(resumeId: number): void {
    this.busyAction = true;

    this.http.post(
      `http://localhost:8080/api/ai/analyze/${resumeId}`,
      {}
    ).subscribe({
      next: (response: any) => {
        console.log('AI Response:', response);
        this.analysisService.analysis = response;
        this.busyAction = false;
        this.router.navigate(['/analysis']);
      },
      error: (error) => {
        console.error('Analysis failed:', error);
        this.busyAction = false;
        this.router.navigate(['/analysis']);
      }
    });
  }

}