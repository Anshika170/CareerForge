import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
export class JobMatch {

  jobDescription = '';

  loading = false;

  results: JobMatchResult[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

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