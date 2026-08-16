import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
// Analysis service removed from dashboard to drop snapshot feature

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
  // snapshot-related state removed

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
    }
  }

  loadDashboardData(): void {

    this.http.get<UserProfileResponse>(
      'http://localhost:8080/api/users/me'
    ).subscribe({
      next: (profile) => {
        this.userName = `Welcome back, ${profile.firstName || 'User'}`;
      },

      error: (error) => {
        console.error('Failed to load user profile:', error);

        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('token');
        }

        this.router.navigate(['/login']);
      }
    });
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
