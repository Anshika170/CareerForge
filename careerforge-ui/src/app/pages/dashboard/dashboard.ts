import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

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
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {

  userName = 'Welcome back';
  isDarkMode = false;
  // snapshot-related state removed

  constructor(
    private http: HttpClient,
    private router: Router,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.themeService.initialize();
      this.isDarkMode = this.themeService.isDarkMode;
      this.loadDashboardData();
    }
  }

  toggleTheme(): void {
    this.isDarkMode = this.themeService.toggleTheme();
  }

  loadDashboardData(): void {
    if (typeof localStorage === 'undefined' || !localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

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
