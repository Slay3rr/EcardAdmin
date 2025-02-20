import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from './../../../services/article.service';

@Component({
  selector: 'app-article-create',
  standalone: true,
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css']
})
export class ArticleCreateComponent {
  categories: any[] = [];
  error: string = '';
  
  constructor(
    private articleService: ArticleService,
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

  async createArticle(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    try {
      const articleToSend = {
        Titre: (form.querySelector('#titre') as HTMLInputElement).value,
        content: (form.querySelector('#content') as HTMLTextAreaElement).value,
        price: Number((form.querySelector('#price') as HTMLInputElement).value),
        Category: Number((form.querySelector('#category') as HTMLSelectElement).value)
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