import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AnalysisService, AnalysisResponse } from '../../services/analysis';

interface ResumeResponse {
  id: number;
  fileName: string;
  fileType: string;
  uploadedAt: string;
}

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis.html',
  styleUrl: './analysis.css'
})
export class Analysis implements OnInit {

  selectedFile: File | null = null;
  uploading = false;
  analysis: AnalysisResponse | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private analysisService: AnalysisService
  ) {}

  ngOnInit(): void {
    this.analysis = this.analysisService.analysis;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedFile = input.files[0];
    this.uploadAndAnalyze();
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

  uploadAndAnalyze(): void {
    if (!this.selectedFile) {
      return;
    }

    this.uploading = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8080/api/resume/upload', formData, {
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.http.get<ResumeResponse[]>('http://localhost:8080/api/resume/my').subscribe({
          next: (resumes) => {
            const latestResume = resumes[resumes.length - 1];

            if (!latestResume) {
              this.uploading = false;
              return;
            }

            this.http.post(
              `http://localhost:8080/api/ai/analyze/${latestResume.id}`,
              {}
            ).subscribe({
              next: (response: any) => {
                this.analysis = response;
                this.analysisService.analysis = response;
                this.uploading = false;
                this.selectedFile = null;
              },
              error: (error) => {
                console.error('Analysis failed:', error);
                this.uploading = false;
              }
            });
          },
          error: (error) => {
            console.error('Resume list load failed:', error);
            this.uploading = false;
          }
        });
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.uploading = false;
      }
    });
  }

}