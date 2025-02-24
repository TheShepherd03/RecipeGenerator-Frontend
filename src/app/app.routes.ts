import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { SearchRecipesComponent } from './search-recipes/search-recipes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'search', component: SearchRecipesComponent },
  { path: 'recipe/:id', component: RecipeDetailsComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '/search' }
];
