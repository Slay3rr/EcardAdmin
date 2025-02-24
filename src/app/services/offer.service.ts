import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private baseUrl = 'http://web006.azure.certif.academy/api/admin';

  private getHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      'Content-Type': 'application/json'
    };
  }

  deleteOffer(articleId: number, offerId: number): Promise<void> {
    try {
      return axios.delete(`${this.baseUrl}/articles/${articleId}/offres/${offerId}`, {
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error('Erreur deleteOffer:', error);
      throw error;
    }
  }
}