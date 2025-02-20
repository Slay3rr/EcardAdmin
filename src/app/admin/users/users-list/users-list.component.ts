import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  users: any[] = [];
  error: string = '';

  constructor(private userService: UserService) {}

  async ngOnInit() {
    try {
      this.users = await this.userService.getAllUsers();
    } catch (error) {
      this.error = 'Erreur lors du chargement des utilisateurs';
    }
  }

  async deleteUser(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await this.userService.deleteUser(id);
        this.users = this.users.filter(user => user.id !== id);
      } catch (error) {
        this.error = 'Erreur lors de la suppression';
      }
    }
  }
}