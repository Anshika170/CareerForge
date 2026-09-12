import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from '../../services/theme.service';

interface AnalysisResponse {
  atsScore: number;
  summary: string;
  strengths: string[];
  missingSkills: string[];
  suggestions: string[];
  jobRoles: string[];
}

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis.html',
  styleUrl: './analysis.css'
})
export class Analysis implements OnInit {

  analysis: AnalysisResponse | null = null;

  loading = true;

  currentStep = 0;

  steps = [
    'Reading your resume...',
    'Extracting experience...',
    'Identifying skills...',
    'Comparing ATS keywords...',
    'Generating AI recommendations...'
  ];

  resumeId: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.themeService.initialize();
    }

    console.log('Analysis component loaded');

    this.route.queryParams.subscribe(params => {

      const id = params['resumeId'];

      console.log('Resume ID received:', id);

      if (!id) {
        console.error('No resumeId found in URL');
        this.loading = false;
        return;
      }

      this.resumeId = Number(id);

      this.startAnalysis();
    });
  }

  startAnalysis(): void {

    if (!this.resumeId) {
      return;
    }

    this.loading = true;
    this.currentStep = 0;

    console.log(
      'Starting analysis for resume:',
      this.resumeId
    );

    const interval = setInterval(() => {

      if (this.currentStep < this.steps.length - 1) {

        this.currentStep++;

      } else {

        clearInterval(interval);

      }

    }, 1000);

    this.http.post<AnalysisResponse>(
      `http://localhost:8080/api/ai/analyze/${this.resumeId}`,
      {}
    ).subscribe({

      next: (response) => {

      console.log('AI Response:', response);

      clearInterval(interval);

      this.currentStep = this.steps.length - 1;

      this.analysis = response;

      console.log('Analysis assigned:', this.analysis);

      this.loading = false;
      this.cdr.detectChanges();

      console.log('Loading changed to:', this.loading);

    },
      error: (error) => {

        console.error('Analysis failed:', error);

        clearInterval(interval);

        this.loading = false;
      }

    });
  }

  goToResume(): void {
    this.router.navigate(['/resume']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {

    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }

  getScoreMessage(): string {
  const score = this.analysis?.atsScore ?? 0;

  if (score >= 80) {
    return 'Excellent! Your resume is highly optimized for ATS systems.';
  }

  if (score >= 60) {
    return 'Good! Your resume is reasonably optimized, but there is room for improvement.';
  }

  if (score >= 40) {
    return 'Your resume needs some improvements to perform better with ATS systems.';
  }

  return 'Your resume needs significant optimization for ATS systems.';
}
}