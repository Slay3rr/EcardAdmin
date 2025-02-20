import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { authGuard, loginGuard } from './guards/auth.guard';
import { ArticlesListComponent } from './admin/articles/articles-list/articles-list.component';
import { ArticleDetailComponent } from './admin/articles/article-detail/article-detail.component';
import { ArticleCreateComponent } from './admin/articles/article-create/article-create.component';



export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'articles',
        children: [
            {
                path: '',
                component: ArticlesListComponent
            },
            {
                path: 'create',  // Ajout de la route pour la création
                component: ArticleCreateComponent
            },
            {
                path: ':id',
                component: ArticleDetailComponent
            }
        ]
    },
      {
        path: 'users',
        loadComponent: () => import('./admin/users/users-list/users-list.component')
          .then(m => m.UsersListComponent)
      },
      {
        path: 'users/:id',
        loadComponent: () => import('./admin/users/user-form/user-form.component')
          .then(m => m.UserFormComponent)},
      {
        path: 'offers',
        loadComponent: () => import('./admin/offers/offers-list/offers-list.component')
          .then(m => m.OffersListComponent)
      }
    ]
  },
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];