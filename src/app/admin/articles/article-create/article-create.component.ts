import { Component, OnInit } from '@angular/core';
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
export class ArticleCreateComponent implements OnInit {
  categories: any[] = [];
  images: any[] = []; // Pour stocker les images disponibles
  error: string = '';
  selectedImageId: string | null = null;
  
  constructor(
    private articleService: ArticleService,
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadImages(); // Charger les images au démarrage
  }

  async loadCategories() {
    try {
      this.categories = await this.articleService.getCategories();
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      this.error = 'Erreur lors du chargement des catégories';
    }
  }

  async loadImages() {
    try {
      this.images = await this.imageService.getAllImages();
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
      this.error = 'Erreur lors du chargement des images';
    }
  }

  selectImage(imageId: string) {
    this.selectedImageId = imageId;
  }

  async createArticle(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    if (!this.selectedImageId) {
      this.error = 'Veuillez sélectionner une image';
      return;
    }

    try {
      const articleToSend = {
        Titre: (form.querySelector('#titre') as HTMLInputElement).value,
        content: (form.querySelector('#content') as HTMLTextAreaElement).value,
        price: Number((form.querySelector('#price') as HTMLInputElement).value),
        Category: Number((form.querySelector('#category') as HTMLSelectElement).value),
        imageId: this.selectedImageId  // On envoie l'ID de l'image MongoDB
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