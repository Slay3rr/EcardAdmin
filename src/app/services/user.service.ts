import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  firstName: string;  
  name: string;      
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private router: Router) {}

  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      console.log('Réponse API:', response); // Pour débugger
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
      }
      throw error;
    }
  }

  // Récupérer un utilisateur par son ID
  async getUserById(id: number): Promise<User> {
    try {
      const response = await axios.get(`${this.apiUrl}/admin/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur détaillée pour l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un utilisateur
  async deleteUser(id: number): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/admin/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
    } catch (error) {
      console.error(`Erreur détaillée pour la suppression ${id}:`, error);
      throw error;
    }
  }
}