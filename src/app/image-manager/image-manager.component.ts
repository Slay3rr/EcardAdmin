import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ImageService, CardImage } from '../services/image.service';

@Component({
  selector: 'app-image-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './image-manager.component.html',
  styleUrl: './image-manager.component.css'
})
export class ImageManagerComponent implements OnInit {
  images: CardImage[] = [];
  selectedFile: File | null = null;
  uploadForm: FormGroup;
  editForm: FormGroup;
  editingImage: CardImage | null = null;

  constructor(
    private imageService: ImageService,
    private fb: FormBuilder
  ) {
    this.uploadForm = this.fb.group({
      cardName: [''],
      type: ['']
    });

    this.editForm = this.fb.group({
      cardName: [''],
      type: ['']
    });
  }

  async ngOnInit() {
    await this.loadImages();
  }

  async loadImages() {
    try {
      this.images = await this.imageService.getAllImages();
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  async onUpload() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('cardName', this.uploadForm.get('cardName')?.value);
    formData.append('type', this.uploadForm.get('type')?.value);

    try {
      // Changement ici : uploadImage -> uploadArticleImage
      await this.imageService.uploadArticleImage(formData);
      await this.loadImages();
      this.resetForm();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
}

  startEditing(image: CardImage) {
    this.editingImage = image;
    this.editForm.patchValue({
      cardName: image.cardName,
      type: image.type
    });
  }

  async saveEdit() {
    if (!this.editingImage) return;

    try {
      await this.imageService.editImage(this.editingImage.id, this.editForm.value);
      await this.loadImages();
      this.cancelEdit();
    } catch (error) {
      console.error('Error editing image:', error);
    }
  }

  cancelEdit() {
    this.editingImage = null;
    this.editForm.reset();
  }

  private resetForm() {
    this.selectedFile = null;
    this.uploadForm.reset();
  }
}