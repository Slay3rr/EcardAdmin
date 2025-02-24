import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from './../../../services/article.service';
import { ImageService } from './../../../services/image.service';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-article-create',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
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
  formData = signal({
    titre: '',
    content: '',
    price: 0,
    category: ''
  });
  formIsValid = signal(false);

  constructor(
    private articleService: ArticleService,
    private imageService: ImageService,
    private router: Router
  ) {}

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
      
      // Assurez-vous que les types ne sont pas vides et sont uniques
      const types = imgs
        .map(img => img.type)
        .filter(type => type && type.trim() !== '');  // Filtrer les types vides
      
      this.imageTypes.set([...new Set(types)]);  // Utiliser Set pour garantir l'unicité
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

  onInputChange(event: Event) {
    // Force un recalcul du signal computed
    this.selectedImageId.set(this.selectedImageId());
  }

  checkFormValidity() {
    const titre = (document.querySelector('#titre') as HTMLInputElement)?.value;
    const content = (document.querySelector('#content') as HTMLTextAreaElement)?.value;
    const price = Number((document.querySelector('#price') as HTMLInputElement)?.value);
    const category = (document.querySelector('#category') as HTMLSelectElement)?.value;
    const imageSelected = this.selectedImageId();

    console.log('Vérification du formulaire:', {
      titre,
      content,
      price,
      category,
      imageSelected
    });

    const isValid = Boolean(
      titre && 
      content && 
      price > 0 && 
      category && 
      imageSelected
    );

    console.log('Formulaire valide:', isValid);
    this.formIsValid.set(isValid);
    return isValid;
  }
  async createArticle(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    if (!this.formIsValid()) {
      console.log('Formulaire invalide:', {
        titre: (form.querySelector('#titre') as HTMLInputElement)?.value,
        content: (form.querySelector('#content') as HTMLTextAreaElement)?.value,
        price: (form.querySelector('#price') as HTMLInputElement)?.value,
        category: (form.querySelector('#category') as HTMLSelectElement)?.value,
        imageId: this.selectedImageId()
      });
      this.error.set('Veuillez remplir tous les champs correctement');
      return;
    }

    try {
      const articleToSend = {
        Titre: (form.querySelector('#titre') as HTMLInputElement).value,
        content: (form.querySelector('#content') as HTMLTextAreaElement).value,
        price: Number((form.querySelector('#price') as HTMLInputElement).value),
        Category: Number((form.querySelector('#category') as HTMLSelectElement).value),
        imageId: this.selectedImageId()
      };

      console.log('Données à envoyer:', articleToSend);
      await this.articleService.createArticle(articleToSend);
      this.router.navigate(['/admin/articles']);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      this.error.set('Erreur lors de la création de l\'article');
    }
  }
  
}