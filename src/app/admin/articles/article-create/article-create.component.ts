import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService } from './../../../services/article.service';
import { ImageService } from './../../../services/image.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-article-create',
  standalone: true,
  imports: [
    CommonModule,
    ScrollingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css']
})
export class ArticleCreateComponent implements OnInit {
  categories = signal<any[]>([]);
  images = signal<any[]>([]);
  filteredImages = signal<any[]>([]);
  error = signal<string>('');
  selectedImageId = signal<string | null>(null);
  selectedImage = signal<any | null>(null);
  showImageSelector = signal<boolean>(false);
  searchQuery = signal<string>('');
  selectedType = signal<string>('');
  imageTypes = signal<string[]>([]);
  articleForm: FormGroup;

  constructor(
    private articleService: ArticleService,
    private imageService: ImageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.articleForm = this.fb.group({
      titre: ['', Validators.required],
      content: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadImages();
  }

  // Modifié pour correspondre à (ngSubmit)="createArticle()"
  async createArticle() {
    if (this.articleForm.invalid || !this.selectedImageId()) {
      this.error.set('Veuillez remplir tous les champs correctement');
      return;
    }

    try {
      const formValues = this.articleForm.value;
      const articleToSend = {
        Titre: formValues.titre,
        content: formValues.content,
        price: Number(formValues.price),
        Category: Number(formValues.category),
        imageId: this.selectedImageId()
      };

      console.log('Envoi de l\'article:', articleToSend);
      await this.articleService.createArticle(articleToSend);
      this.router.navigate(['/admin/articles']);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      this.error.set('Erreur lors de la création de l\'article');
    }
  }

  // Reste des méthodes...
  updateSearch(event: string) {
    this.searchQuery.set(event);
    this.filterImages();
  }

  updateType(event: string) {
    this.selectedType.set(event);
    this.filterImages();
  }

  async loadCategories() {
    try {
      const cats = await this.articleService.getCategories();
      this.categories.set(cats);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      this.error.set('Erreur lors du chargement des catégories');
    }
  }

  async loadImages() {
    try {
      const imgs = await this.imageService.getAllImages();
      this.images.set(imgs);
      const types = imgs
        .map(img => img.type)
        .filter(type => type && type.trim() !== '');
      this.imageTypes.set([...new Set(types)]);
      this.filterImages();
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
      this.error.set('Erreur lors du chargement des images');
    }
  }

  filterImages() {
    const filtered = this.images().filter(image => {
      const matchesSearch = this.searchQuery() ? 
        image.cardName.toLowerCase().includes(this.searchQuery().toLowerCase()) : true;
      const matchesType = this.selectedType() ? 
        image.type === this.selectedType() : true;
      return matchesSearch && matchesType;
    });
    this.filteredImages.set(filtered);
  }

  toggleImageSelector() {
    this.showImageSelector.update(v => !v);
  }

  selectImage(image: any) {
    this.selectedImage.set(image);
    this.selectedImageId.set(image._id);
    this.showImageSelector.set(false);
  }
}