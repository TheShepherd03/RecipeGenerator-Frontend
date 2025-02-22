import { Component } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search-recipes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './search-recipes.component.html',
  styleUrls: ['./search-recipes.component.css']
})
export class SearchRecipesComponent {
  searchQuery: string = '';
  searchResults: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  search(): void {
    if (this.searchQuery.trim()) {
      const ingredients = this.searchQuery.toLowerCase().split(',').map(i => i.trim());
      this.recipeService.searchByIngredients(ingredients).subscribe((recipes) => {
        this.searchResults = recipes;
      });
    }
  }
}
