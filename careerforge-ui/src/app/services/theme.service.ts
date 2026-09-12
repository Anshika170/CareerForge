import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  initialize(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedTheme = localStorage.getItem('theme');
    this.darkMode = savedTheme === 'dark';
    this.applyTheme();
  }

  toggleTheme(): boolean {
    this.darkMode = !this.darkMode;
    this.applyTheme();
    return this.darkMode;
  }

  applyTheme(): void {
    if (!isPlatformBrowser(this.platformId) || typeof document === 'undefined') {
      return;
    }

    document.body.classList.toggle('dark-mode', this.darkMode);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    }
  }

  get isDarkMode(): boolean {
    return this.darkMode;
  }
}
