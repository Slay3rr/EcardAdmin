import { Injectable } from '@angular/core';
import axiosInstance from './axios.config';  // Utilisez l'instance configurée

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private endpoint = 'http://web006.azure.certif.academy/api/admin/articles';

  async getCategories() {
    try {
      const response = await axiosInstance.get(`${this.endpoint}/categories`);
      return response.data;
    } catch (error) {
      console.error('Erreur getCategories:', error);
      throw error;
    }
  }

  async getArticles() {
    try {
      const response = await axiosInstance.get(this.endpoint);
      return response.data;
    } catch (error) {
      console.error('Erreur getAllArticles:', error);
      throw error;
    }
  }

  async getArticle(id: number) {
    try {
      const response = await axiosInstance.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur getArticle:', error);
      throw error;
    }
  }

  async createArticle(articleData: any) {
    try {
      const response = await axiosInstance.post(this.endpoint, articleData);
      return response.data;
    } catch (error) {
      console.error('Erreur createArticle:', error);
      throw error;
    }
  }

  async updateArticle(id: number, articleData: any) {
    try {
      const response = await axiosInstance.put(`${this.endpoint}/${id}`, articleData);
      return response.data;
    } catch (error) {
      console.error('Erreur updateArticle:', error);
      throw error;
    }
  }

  async deleteArticle(id: number) {
    try {
      await axiosInstance.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Erreur deleteArticle:', error);
      throw error;
    }
  }
}