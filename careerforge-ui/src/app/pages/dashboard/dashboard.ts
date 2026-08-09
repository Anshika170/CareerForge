import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AnalysisResponse, AnalysisService } from '../../services/analysis';

interface UserProfileResponse {
  firstName: string;
  lastName: string;
  email: string;
}

interface ResumeResponse {
  id: number;
  fileName: string;
  fileType: string;
  uploadedAt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  userName = 'Welcome back';
  resumeCount = 0;
  atsScore: number | null = null;
  skillsCount = 0;
  skillGapsCount = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private analysisService: AnalysisService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
    }
  }

  loadDashboardData(): void {
    this.http.get<UserProfileResponse>('http://localhost:8080/api/users/me').subscribe({
      next: (profile) => {
        this.userName = `Welcome back, ${profile.firstName || 'User'}`;

        this.http.get<ResumeResponse[]>('http://localhost:8080/api/resume/my').subscribe({
          next: (resumes) => {
            this.resumeCount = resumes.length;
          },
          error: (error) => {
            console.error('Failed to load resume snapshot:', error);
            this.resumeCount = 0;
          }
        });
      },
      error: (error) => {
        console.error('Failed to load user profile:', error);

        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('token');
        }

        this.router.navigate(['/login']);
      }
    });

    const latestAnalysis = this.analysisService.analysis;
    if (latestAnalysis) {
      this.atsScore = latestAnalysis.atsScore;
      this.skillsCount = latestAnalysis.strengths.length;
      this.skillGapsCount = latestAnalysis.missingSkills.length;
    }
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }

  goToJobMatch(): void {
  this.router.navigate(['/job-match']);
}
}
