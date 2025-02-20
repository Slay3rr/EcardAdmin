import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://127.0.0.1:8000/api';

  constructor(private router: Router) {
    this.initializeAxios();
  }

  private initializeAxios(): void {
    // Configuration globale d'Axios
    axios.defaults.baseURL = this.API_URL;
    
    // Ajouter l'intercepteur pour tous les appels
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur pour gérer les redirections et erreurs d'auth
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 302) {
          console.log('Token invalide ou expiré');
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post('/login', { email, password });
      console.log('Réponse login:', response); // Debug

      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        await this.router.navigate(['/admin/dashboard']);
      } else {
        console.error('Pas de token dans la réponse');
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Erreur login:', error);
      throw error;
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem('auth_token');
    if (token) {
      console.log('Token trouvé:', token.substring(0, 20) + '...'); // Debug - montre le début du token
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