import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private endpoint = 'http://web006.azure.certif.academy/api/admin/articles'; // URL complète
  private getHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      'Content-Type': 'application/json'
    };
  }
  async getCategories() {
    try {
      const response = await axios.get(`${this.endpoint}/categories`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erreur getCategories:', error);
      throw error;
    }
  }

  async getArticles() {
    try {
      const response = await axios.get(this.endpoint, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      console.error('Erreur getAllArticles:', error);
      throw error;
    }
  }

  async getArticle(id: number) {
    try {
      const response = await axios.get(`${this.endpoint}/${id}`, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      console.error('Erreur getArticle:', error);
      throw error;
    }
  }

  async createArticle(articleData: any) {
    try {
      const response = await axios.post(this.endpoint, articleData, { 
        headers: this.getHeaders() 
      });
      return response.data;
    } catch (error) {
      console.error('Erreur createArticle:', error);
      throw error;
    }
  }

  async updateArticle(id: number, articleData: any) {
    try {
      const response = await axios.put(`${this.endpoint}/${id}`, articleData, { 
        headers: this.getHeaders() 
      });
      return response.data;
    } catch (error) {
      console.error('Erreur updateArticle:', error);
      throw error;
    }
  }

  async deleteArticle(id: number) {
    try {
      await axios.delete(`${this.endpoint}/${id}`, { headers: this.getHeaders() });
    } catch (error) {
      console.error('Erreur deleteArticle:', error);
      throw error;
    }
  }
}