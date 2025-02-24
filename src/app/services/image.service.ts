import { Injectable } from '@angular/core';
import axios from 'axios';

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
  private apiUrl = 'http://localhost:8000/api/admin';

  async uploadArticleImage(formData: FormData): Promise<any> {
    const response = await axios.post(`${this.apiUrl}/upload-image`, formData);
    return response.data;
  }

  // Ajout des méthodes manquantes
  async getAllImages(): Promise<CardImage[]> {
    const response = await axios.get(`${this.apiUrl}/images`);
    return response.data;
  }

  async editImage(id: string, data: { cardName: string; type: string }): Promise<any> {
    const response = await axios.patch(`${this.apiUrl}/images/${id}`, data);
    return response.data;
  }
}