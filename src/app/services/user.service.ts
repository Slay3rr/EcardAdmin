import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axiosInstance from './axios.config';

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
  private endpoint = '/admin/users';

  constructor(private router: Router) {}

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get(this.endpoint);
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await axiosInstance.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur détaillée pour l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Erreur détaillée pour la suppression ${id}:`, error);
      throw error;
    }
  }
}