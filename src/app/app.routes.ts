import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { SearchRecipesComponent } from './search-recipes/search-recipes.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add', component: AddRecipeComponent },
  { path: 'recipe/:id', component: RecipeDetailsComponent },
  { path: 'recipe/:id/edit', component: EditRecipeComponent },
  { path: 'search', component: SearchRecipesComponent },
  { path: '**', redirectTo: '' }
];
