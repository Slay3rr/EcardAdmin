import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { FormsModule } from '@angular/forms';


interface Category {
  id: number;
  name: string;
}
interface User {
  id: number;
  email: string;
  username: string;
}
interface Offre {
  id: number;
  price: number;
  quantity: number;
  description?: string;
  user?: User;
}
interface Article {
  id: number;
  Titre: string;
  content: string;
  price: number;
  Category: Category[];
  offres: Offre[];

}

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  article: any = null;
  error = '';
  isEditing = false;
  editedArticle: Partial<Article> = {};

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.params['id'];
    try {
      this.article = await this.articleService.getArticle(id);
      console.log('Article reçu:', this.article);
      this.editedArticle = {
        Titre: this.article.Titre,
        content: this.article.content,
        price: this.article.price
        // On ne copie pas Category pour l'édition
      };
    } catch (error) {
      this.error = 'Erreur lors du chargement de l\'article';
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editedArticle = {
        Titre: this.article.Titre,
        content: this.article.content,
        price: this.article.price
      };
    }
  }

  getCategoryNames(): string {
    if (this.article?.Category && this.article.Category.length > 0) {
      return this.article.Category.map((cat: Category) => cat.name).join(', ');
    }
    return 'Aucune catégorie';
}

  async onSave() {
    try {
      const updatedArticle = await this.articleService.updateArticle(
        this.article.id, 
        {
          Titre: this.editedArticle.Titre,
          content: this.editedArticle.content,
          price: this.editedArticle.price
          // Ne pas envoyer Category pour ne pas perturber la mise à jour
        }
      );
      this.article = updatedArticle;
      this.isEditing = false;
      this.error = '';
    } catch (error: any) {
      this.error = 'Erreur lors de la mise à jour';
      if (error.response?.data?.errors) {
        this.error = error.response.data.errors.map((err: any) => err.message).join(', ');
      }
    }
  }

  onCancel(): void {
    this.isEditing = false;
    this.editedArticle = {
      Titre: this.article.Titre,
      content: this.article.content,
      price: this.article.price
    };
  }
}