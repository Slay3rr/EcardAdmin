import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService) {}

  async onSubmit(event: Event) {
    event.preventDefault();
    try {
      await this.authService.login(this.username, this.password);
    } catch (error) {
      this.error = 'Erreur lors de la connexion';
    }
  }
}