import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/auth';

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, {
      email: email,
      password: password
    });
  }
}