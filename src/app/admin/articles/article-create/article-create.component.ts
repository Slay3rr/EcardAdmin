import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from './../../../services/article.service';
import { ImageService } from './../../../services/image.service';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface FormState {
  titre: string;
  content: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-article-create',
  standalone: true,
  imports: [CommonModule, ScrollingModule, ReactiveFormsModule],
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css']
})
export class ArticleCreateComponent implements OnInit {
  // Signals pour les données
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

  // Signal pour l'état du formulaire
  formState = signal<FormState>({
    titre: '',
    content: '',
    price: 0,
    category: ''
  });

  // Signal computed pour la validité du formulaire
  formIsValid = computed(() => {
    const state = this.formState();
    return Boolean(
      state.titre &&
      state.content &&
      state.price > 0 &&
      state.category &&
      this.selectedImageId()
    );
  });

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

  updateFormField(field: keyof FormState, value: string | number) {
    this.formState.update(state => ({
      ...state,
      [field]: value
    }));
  }

  toggleImageSelector() {
    this.showImageSelector.update(v => !v);
  }

  selectImage(image: any) {
    this.selectedImage.set(image);
    this.selectedImageId.set(image._id);
    this.showImageSelector.set(false);
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.filterImages();
  }

  updateType(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedType.set(select.value);
    this.filterImages();
  }

  async createArticle(event: Event) {
    event.preventDefault();
    
    if (!this.formIsValid()) {
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
}