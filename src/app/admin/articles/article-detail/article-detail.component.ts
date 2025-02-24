import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { FormsModule } from '@angular/forms';
import { OfferService } from '../../../services/offer.service';



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
  providers: [ArticleService, OfferService], // Ajout du OfferService ici
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  article: any = null;
  error = '';
  isEditing = false;
  editedArticle: Partial<Article> = {};
  isDeleting = false;


  constructor(
    private articleService: ArticleService,
    private offerService: OfferService, // Ajouter le service d'offres

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
  async deleteOffer(offerId: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      return;
    }
  
    try {
      this.isDeleting = true;
      // On passe l'ID de l'article et l'ID de l'offre
      await this.offerService.deleteOffer(this.article.id, offerId);
      
      // Recharger l'article
      const id = this.route.snapshot.params['id'];
      this.article = await this.articleService.getArticle(id);
      
    } catch (error: any) {
      this.error = 'Erreur lors de la suppression de l\'offre';
      if (error.response?.data?.message) {
        this.error = error.response.data.message;
      }
    } finally {
      this.isDeleting = false;
    }
  }
}
