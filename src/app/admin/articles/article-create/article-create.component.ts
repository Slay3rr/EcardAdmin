import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from './../../../services/article.service';
import { ImageService } from './../../../services/image.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-create',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css']
})
export class ArticleCreateComponent {
  categories: any[] = [];
  error: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  
  constructor(
    private articleService: ArticleService,
    private imageService: ImageService,  // Ajout du service d'images
    private router: Router
  ) {
    this.loadCategories();
  }

  async loadCategories() {
    try {
      this.categories = await this.articleService.getCategories();
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      this.error = 'Erreur lors du chargement des catégories';
    }
  }

  // Nouvelle méthode pour gérer la sélection de fichier
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(input.files[0]);
    }
  }

  async createArticle(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    try {
      let imageUrl = null;
      
      // Upload de l'image si une image est sélectionnée
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('image', this.selectedFile);
        formData.append('cardName', (form.querySelector('#titre') as HTMLInputElement).value);
        formData.append('type', 'article');
        
        const imageResponse = await this.imageService.uploadArticleImage(formData);
        imageUrl = imageResponse.url;
      }

      const articleToSend = {
        Titre: (form.querySelector('#titre') as HTMLInputElement).value,
        content: (form.querySelector('#content') as HTMLTextAreaElement).value,
        price: Number((form.querySelector('#price') as HTMLInputElement).value),
        Category: Number((form.querySelector('#category') as HTMLSelectElement).value),
        imageUrl: imageUrl  // Ajout de l'URL de l'image
      };

      console.log('Données envoyées:', articleToSend);
      
      await this.articleService.createArticle(articleToSend);
      this.router.navigate(['/admin/articles']);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      this.error = 'Erreur lors de la création de l\'article';
    }
  }
}