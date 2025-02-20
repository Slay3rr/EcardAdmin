import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    
    this.authService.login(this.email, this.password)
      .catch(error => {
        console.error('Erreur de connexion:', error);
        this.error = 'Erreur lors de la connexion';
      });
  }
}