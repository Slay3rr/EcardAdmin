import { Injectable } from '@angular/core';
import axiosInstance from './axios.config'; // Importez l'instance configurée

export interface CardImage {
  id: string;
  publicId: string;
  url: string;
  cardName: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = '/admin'; 
  async uploadArticleImage(formData: FormData): Promise<any> {
    // Utilisez axiosInstance au lieu de axios
    const response = await axiosInstance.post(`${this.apiUrl}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Important pour l'upload de fichiers
      }
    });
    return response.data;
  }

  async getAllImages(): Promise<CardImage[]> {
    // Utilisez axiosInstance au lieu de axios
    const response = await axiosInstance.get(`${this.apiUrl}/images`);
    return response.data;
  }

  async editImage(id: string, data: { cardName: string; type: string }): Promise<any> {
    // Utilisez axiosInstance au lieu de axios
    const response = await axiosInstance.patch(`${this.apiUrl}/images/${id}`, data);
    return response.data;
  }
}