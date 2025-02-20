import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleService } from '../../../services/article.service';

@Component({
  selector: 'app-articles-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './articles-list.component.html'
})
export class ArticlesListComponent implements OnInit {
  articles: any[] = [];
  error = '';

  constructor(private articleService: ArticleService) {}

  async ngOnInit() {
    try {
      this.articles = await this.articleService.getArticles();
    } catch (error) {
      this.error = 'Erreur lors du chargement des articles';
    }
  }

  async onDelete(id: number) {
    if (confirm('Confirmer la suppression ?')) {
      try {
        await this.articleService.deleteArticle(id);
        this.articles = this.articles.filter(article => article.id !== id);
      } catch (error) {
        this.error = 'Erreur lors de la suppression';
      }
    }
  }
}