import { ChangeDetectorRef, Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from '../../services/theme.service';

interface JobMatchResult {
  resumeId: number;
  fileName: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  reason: string;
}

@Component({
  selector: 'app-job-match',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './job-match.html',
  styleUrl: './job-match.css'
})
export class JobMatch implements OnInit {

  jobDescription = '';

  loading = false;

  results: JobMatchResult[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.themeService.initialize();
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  findBestMatch(): void {

  if (!this.jobDescription.trim()) {
    return;
  }

  this.loading = true;
  this.results = [];

  this.http.post<JobMatchResult[]>(
    'http://localhost:8080/api/ai/job-match',
    {
      jobDescription: this.jobDescription
    }
  ).subscribe({
    next: (response) => {
    this.results = response;
    this.loading = false;
    this.cdr.detectChanges();
},
    error: (error) => {
      console.error('❌ JOB MATCH FAILED:', error);
      this.loading = false;
    }
  });
}
}