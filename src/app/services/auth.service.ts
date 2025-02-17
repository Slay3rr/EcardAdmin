import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private router: Router) {}

  async login(username: string, password: string): Promise<void> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/login`,
        {
          email: username,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        this.router.navigate(['/admin/dashboard']);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}