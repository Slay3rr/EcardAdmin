import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axiosInstance from './axios.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      console.log('Réponse complète:', JSON.stringify(response.data)); // Pour voir la structure exacte

      // On vérifie si le token existe dans la réponse
      const token = response.data.token || response.data.access_token;
      if (token) {
        localStorage.setItem('auth_token', token);
        await this.router.navigate(['/admin/dashboard']);
      } else {
        console.error('Structure de la réponse:', response.data);
        throw new Error('Token non trouvé dans la réponse');
      }
    } catch (error) {
      console.error('Erreur login détaillée:', error);
      throw error;
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem('auth_token');
    if (token) {
      console.log('Token trouvé:', token.substring(0, 20) + '...');
    } else {
      console.log('Pas de token trouvé');
    }
    return token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}